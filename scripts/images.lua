--[[
Image Grid Filter for Pandoc
Converts markdown div blocks with "image" + number classes into responsive image grids.

Usage in markdown:
::: image3
- image1.jpg
- image2.jpg | Description text shows as overlay on hover
:::

::: image4
- book1.jpg | Review text
:::
--]]

function Div(div)
    -- Check if any class starts with "image" followed by a number
    local columns = nil
    for _, class in ipairs(div.classes) do
        local num = string.match(class, "^image(%d+)$")
        if num then
            columns = num
            break
        end
    end
    
    if columns then
        return generate_image_grid(div.content, columns)
    end
    
    return div
end

function generate_image_grid(content, columns)
    -- Generate HTML structure for image grid from bullet list content
    local grid_items = {}
    local base_path = "/assets/images/"

    -- Extract and process bullet list items
    for _, elem in ipairs(content) do
        if elem.tag == "BulletList" then
            for _, item in ipairs(elem.content) do
                local image_data = parse_image_item(item)
                if image_data then
                    local image_item = create_image_item(image_data, base_path)
                    table.insert(grid_items, image_item)
                end
            end
        end
    end

    return pandoc.Div(grid_items, { 
        class = "image-grid",
        style = "--grid-columns: " .. columns 
    })
end

function parse_image_item(item)
    -- Parse a bullet list item into image data components
    -- Expected format: "image.jpg" or "image.jpg | Description text"
    -- Returns table with image, description fields or nil if invalid
    local text = pandoc.utils.stringify(item)
    local parts = {}
    
    -- Split by pipe character and trim whitespace
    for part in string.gmatch(text, "([^|]+)") do
        table.insert(parts, part:match("^%s*(.-)%s*$"))
    end

    if #parts >= 1 then
        return {
            image = parts[1],
            description = parts[2] or nil  -- nil if no description
        }
    end

    return nil
end

function create_image_item(image_data, base_path)
    -- Create HTML structure for a single image item
    local image_elem = pandoc.Para({
        pandoc.Image("", base_path .. image_data.image, "")
    })

    if image_data.description then
        -- Interactive overlay structure for hoverable images with description
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
        -- Simple image with no description
        return pandoc.Div({
            image_elem
        }, { class = "image-item" })
    end
end