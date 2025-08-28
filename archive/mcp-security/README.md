# MCP Security Archive

This folder contains all MCP (Model Context Protocol) security related files that were removed from the main codebase.

## Archived Files

### Pages
- `mcp-threats/` - MCP threat analysis and monitoring page
- `mcp-catalog/` - MCP tools catalog with security levels
- `mcp-discovery/` - MCP tools discovery functionality

### Utilities
- `mcp-utils.ts` - MCP security utilities and schemas

## Original Locations

- Pages were located in: `src/app/(app)/`
- Utilities were located in: `src/lib/`

## Removed References

The following references were also removed from the codebase:

1. **Navigation constants** (`src/lib/constants.ts`):
   - MCP Security navigation item
   - MCP Discovery navigation item  
   - MCP Threats navigation item

2. **AI Router** (`src/lib/ai-router.ts`):
   - Removed 'mcp-threat' from threat analysis types

3. **Setup Scripts**:
   - Removed 'mcp-security' from feature arrays in:
     - `scripts/setup-companies.ts`
     - `scripts/setup-complete.ts`
     - `scripts/setup-pocketbase-admin.ts`

4. **Documentation** (`docs/index.html`):
   - Removed MCP security from feature list

## Archive Date
Archived on: $(date)

## Notes
These files can be restored if MCP security functionality is needed in the future.