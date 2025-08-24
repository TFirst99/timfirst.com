#!/usr/bin/env python3
"""
RSS Feed Generator for Tim First's Website

Generates RSS feeds from markdown notes by looking for monthly headers
and matching them with git commit dates. Only entries with matching
git commits are included in the RSS feed.
"""

import re
import datetime
import subprocess
import xml.etree.ElementTree as ET


def markdown_to_html(text):
    """Convert markdown to HTML using pandoc."""
    try:
        # Use pandoc to convert markdown to HTML
        result = subprocess.run([
            'pandoc', '--from', 'markdown', '--to', 'html'
        ], input=text, capture_output=True, text=True, encoding='utf-8')
        
        if result.returncode == 0:
            # Clean up pandoc output - remove wrapping <p> tags if it's just a single paragraph
            html = result.stdout.strip()
            if html.startswith('<p>') and html.endswith('</p>') and html.count('<p>') == 1:
                html = html[3:-4]  # Remove <p> and </p>
            return html
        else:
            # Fallback to original text if pandoc fails
            return text
    except FileNotFoundError:
        # If pandoc not found, return original text
        return text


def get_git_commit_date(file_path, month_str):
    """Get the commit date when a commit message contains the month string.

    Args:
        file_path: Path to the file to search commits for
        month_str: String to search for in commit messages (e.g., "August 2025")

    Returns:
        ISO formatted date string of the most recent matching commit, or None
    """
    try:
        result = subprocess.run([
            'git', 'log', '--format=%ai', '--grep=' + month_str,
            '--', file_path
        ], capture_output=True, text=True, cwd='.')

        if result.stdout.strip():
            return result.stdout.strip().split('\n')[0]

        return None
    except subprocess.SubprocessError:
        return None


def parse_notes_file(file_path):
    """Parse markdown notes file and extract monthly entries.

    Args:
        file_path: Path to the notes markdown file

    Returns:
        List of entry dictionaries with month, content, and git_date
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        return []

    # Find all headers (## anything)
    month_pattern = r'^## (.+)\s*$'
    sections = re.split(month_pattern, content, flags=re.MULTILINE)

    entries = []

    # Process sections in pairs (header, content)
    for i in range(1, len(sections), 2):
        if i + 1 < len(sections):
            month_str = sections[i].strip()
            entry_content = sections[i + 1].strip()

            if entry_content:  # Only include non-empty entries
                git_date = get_git_commit_date(file_path, month_str)

                if git_date is not None:
                    entries.append({
                        'month': month_str,
                        'content': entry_content,
                        'git_date': git_date
                    })

    # Sort by git commit date (newest first)
    entries.sort(key=lambda x: x['git_date'], reverse=True)
    return entries


def generate_rss(entries, output_path):
    """Generate RSS XML from entries.

    Args:
        entries: List of entry dictionaries
        output_path: Path to write the RSS XML file
    """
    # Create RSS structure
    rss = ET.Element('rss', version='2.0')
    rss.set('xmlns:atom', 'http://www.w3.org/2005/Atom')

    channel = ET.SubElement(rss, 'channel')

    # Channel metadata
    ET.SubElement(channel, 'title').text = "Tim First"
    ET.SubElement(channel, 'link').text = "https://timfirst.com"
    ET.SubElement(channel, 'description').text = "Economics. Philosophy. Everything else."
    ET.SubElement(channel, 'language').text = "en-us"

    # Last build date
    build_date = datetime.datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')
    ET.SubElement(channel, 'lastBuildDate').text = build_date

    # Atom self-link
    atom_link = ET.SubElement(channel, 'atom:link')
    atom_link.set('href', 'https://timfirst.com/rss.xml')
    atom_link.set('rel', 'self')
    atom_link.set('type', 'application/rss+xml')

    # Add entries as RSS items
    for entry in entries:
        item = ET.SubElement(channel, 'item')

        # Parse git commit date and convert to RFC 2822 format
        git_datetime = datetime.datetime.fromisoformat(entry['git_date'].replace('Z', '+00:00'))
        pub_date = git_datetime.strftime('%a, %d %b %Y %H:%M:%S GMT')

        # Create URL-safe anchor from month string
        anchor = entry['month'].lower().replace(' ', '-')

        ET.SubElement(item, 'title').text = f"Notes - {entry['month']}"
        ET.SubElement(item, 'link').text = f"https://timfirst.com/notes#{anchor}"
        ET.SubElement(item, 'description').text = markdown_to_html(entry['content'])
        ET.SubElement(item, 'pubDate').text = pub_date
        ET.SubElement(item, 'guid').text = f"https://timfirst.com/notes#{anchor}"

    # Write XML file with proper formatting
    tree = ET.ElementTree(rss)
    ET.indent(tree, space="    ")
    tree.write(output_path, encoding='utf-8', xml_declaration=True)


def main():
    """Main function to generate RSS feed."""
    notes_file = "content/pages/notes.md"
    output_file = "output/rss.xml"

    try:
        entries = parse_notes_file(notes_file)
        generate_rss(entries, output_file)
        print(f"Generated RSS with {len(entries)} entries")
    except Exception as e:
        print(f"Error generating RSS: {e}")
        raise


if __name__ == "__main__":
    main()
