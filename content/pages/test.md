---
title: Test Page
date: June 3, 2025
---

This is a test page. It allows me to see how different elements appear on my website. On this page you can currently see text paragraphs, lists, headings, dividers, line breaks, images, links, and code blocks. I only support features that are relevant to my website's purpose.

# Paragraphs
<hr>

Paragraphs looks like this. The font is DejaVu Sans Mono in size 16, which shrinks to size 12 on small screens. Text should wrap when it reaches the maximum width of the container, or when it reaches the maximum width of the screen. I can put paragraphs on separate lines by adding a line break:
<br>
which just starts the text on a new line.

Adding two spaces creates a new paragraph with a full break. This is distinct from a line break, which only creates a new line without starting a new paragraph. Words on this site can be *italicized*, **bolded**, or ***italicized and bolded***.

# Lists & Tables
<hr>

Lists can be created with a hyphen:

- Item 1
- Item 2
- Item 3

or with numbers:

1. Item 1
2. Item 2
3. Item 3

Tables can be created:

|Left Aligned|Center Aligned|Right Aligned|
|:-----------|:------------:|------------:|
|Left 1|Center 1| Right 1|
|Left 2|Center 2| Right 2|
|Left 3|Center 3| Right 3|

By more explicitly defining the table structure, we can create tables with more complex headers and formatting:

+---------------------+-----------------------+
| Location            | Temperature 1961-1990 |
|                     | in degree Celsius     |
|                     +-------+-------+-------+
|                     | min   | mean  | max   |
+=====================+=======+=======+=======+
| Antarctica          | -89.2 | -43.5 | 19.8  |
+---------------------+-------+-------+-------+
| Earth               | -89.2 | 15.2  | 56.7  |
+---------------------+-------+-------+-------+
| Moon                | -173  | -23   | 127   |
+---------------------+-------+-------+-------+

# Blocks
<hr>

Line blocks are the simplest form of block:

| These look nice and clean.
| Maybe you can put a poem
| or something else here.

We can create block quotes:

> This is a block quote. We can **format elements**  inside of a block quote.
>
> - This is a list inside of a block quote.
> - With a second item.

Block quotes can contain nested blockquotes:

> This is a regular block quote, but it can contain a nested element:
>
> > Here is the nested element.
>
> We can return to the original level.

Codeblocks are also supported. Text inside of codeblocks preserves special characters and line breaks:

```
Code example:

print("Hello, world!")

- List
- Without
- Formatting
```

All of these elements can either be created in markdown, or using HTML tags.

# Media
<hr>

We can show images:

![Goldfish](/resources/goldfish.jpg)
