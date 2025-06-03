function Header(elem)
    local div = pandoc.Div(elem.content, pandoc.Attr("", { "heading" }, {}))
    return div
end
