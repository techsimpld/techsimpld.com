# Obsidian Dataview & Templater Snippets

## 1. Recently Modified Notes (Dataview)
Displays the 10 most recently modified notes in your vault.

```dataview
TABLE file.mtime AS "Last Modified"
FROM ""
WHERE file.name != this.file.name
SORT file.mtime desc
LIMIT 10
```

## 2. Incomplete Tasks Rollup (Dataview)
Finds all unchecked checkboxes across your vault.

```dataview
TASK
FROM ""
WHERE !completed
```

## 3. Daily Note Creation Info (Templater)
Inserts the current date, time, and day of the week dynamically.

```markdown
# <% tp.file.title %>
**Date:** <% tp.date.now("YYYY-MM-DD") %>
**Day:** <% tp.date.now("dddd") %>
**Created At:** <% tp.date.now("HH:mm") %>
```

## 4. Notes by Specific Tag (Dataview)
Lists all notes containing the `#project` tag, excluding templates.

```dataview
LIST
FROM #project AND -#template
SORT file.name asc
```
