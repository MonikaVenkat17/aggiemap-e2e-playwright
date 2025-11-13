# Shell Team — App Shell (Header / Nav)

**Scope**  
UI behavior of the application shell: header/banner, global navigation sidebar, and top-level navigation between primary sections (Map, Search, etc.).

**POM APIs (names only)**  
- `gotoHome()`
- `navItem(name)`
- `openSection(name)`

**Definition of Done (DoD)**  
- Tests pass deterministically across two consecutive runs.  
- HTML report + trace artifacts enabled via root Playwright config.  
- No edits outside `apps/aggiemap-angular/e2e/tests/pages/shell`.  
- Selectors prefer roles/labels (ARIA).  
- Only add `data-testid` when absolutely needed; prefix with `shell-`.  
- No fixed sleeps — must use Playwright auto-waiting & expectations.  

**Dependencies**  
- App exposes accessible roles for banner (`role="banner"`), navigation (`role="navigation"`), and main (`role="main"`).  
- Sidebar/nav items have stable visible labels (e.g., “Map”, “Search”).  

**TestID Prefix**  
`shell-` (only for test IDs added within shell scope).

