--[[
Image Grid Filter for Pandoc
Converts markdown div blocks with "images" or "books" classes into responsive image grids.

Usage in markdown:
::: {.images columns="3" path="/resources/" overlay="false"}
- image1.jpg | Title | Description text
- image2.jpg | Another Title | More description
:::

::: {.books columns="4" path="/resources/books/" overlay="true"}
- book1.jpg | Book Title | Review text
:::
--]]

function Div(div)
    if div.classes:includes("images") then
        local columns = div.attributes.columns or "4"
        local base_path = div.attributes.path or "/resources/"
        local with_overlay = div.attributes.overlay == "true"
        return generate_image_grid(div.content, columns, base_path, with_overlay)
    
    elseif div.classes:includes("books") then
        -- Books have overlay enabled by default for interactive covers
        local columns = div.attributes.columns or "4" 
        local base_path = div.attributes.path or "/resources/books/"
        local with_overlay = (div.attributes.overlay ~= "false")
        return generate_image_grid(div.content, columns, base_path, with_overlay)
    end
    
    return div
end

function generate_image_grid(content, columns, base_path, with_overlay)
    -- Generate HTML structure for image grid from bullet list content
    local grid_items = {}
    base_path = base_path or "/resources/"

    -- Extract and process bullet list items
    for _, elem in ipairs(content) do
        if elem.tag == "BulletList" then
            for _, item in ipairs(elem.content) do
                local image_data = parse_image_item(item)
                if image_data then
                    local image_item = create_image_item(image_data, base_path, with_overlay)
                    table.insert(grid_items, image_item)
                end
            end
        end
    end

    return pandoc.Div(grid_items, { class = "image-grid image-grid-" .. columns })
end

function parse_image_item(item)
    -- Parse a bullet list item into image data components
    -- Expected format: "image.jpg | Title | Description text"
    -- Returns table with image, title, description fields or nil if invalid
    local text = pandoc.utils.stringify(item)
    local parts = {}
    
    -- Split by pipe character and trim whitespace
    for part in string.gmatch(text, "([^|]+)") do
        table.insert(parts, part:match("^%s*(.-)%s*$"))
    end

    if #parts >= 3 then
        return {
            image = parts[1],
            title = parts[2], 
            description = parts[3]
        }
    end

    return nil
end

function create_image_item(image_data, base_path, with_overlay)
    -- Create HTML structure for a single image item
    local image_elem = pandoc.Para({
        pandoc.Image(image_data.title, base_path .. image_data.image, image_data.title)
    })

    if with_overlay then
        -- Interactive overlay structure for books/hoverable images
        return pandoc.Div({
            pandoc.Div({
                image_elem,
                pandoc.Div({
                    pandoc.Div({ 
                        pandoc.Para({ pandoc.Str(image_data.description) }) 
                    }, { class = "image-text" })
                }, { class = "image-overlay" })
            }, { class = "image-cover" })
        }, { class = "image-item" })
        
    else
        -- Simple image item with visible title and description
        return pandoc.Div({
            image_elem,
            pandoc.Para({ pandoc.Strong({ pandoc.Str(image_data.title) }) }),
            pandoc.Para({ pandoc.Str(image_data.description) })
        }, { class = "image-item" })
    end
end