<!-- ## PlayQMeta

When invoked, read from:
  - playq/meta/knowledge/**
  - playq/meta/templates/**
Purpose:
  Generate PlayQ-style BDD test cases with reusable steps and examples.

Behaviour:
  - **MANDATORY**: Every test case MUST start with login and end with logout
  - Always include a login step at the beginning of each test case.
  - Always include a logout step at the end of each test case.
  - If workflow JSON already contains login or logout, do not duplicate them.
  - Use the standard PlayQ login syntax from pack if available:
        * <Domain>: Login using Microsoft SSO -sessionName: "#{env.session}" -url: "#{env.url}" -username: "#{env.user}" -password: "#{env.password}"
  - Use the standard PlayQ logout syntaxfrom pack if available:
        * <Domain>: Logout -options: ""
  - If available please use Knowledge pack and template given for the domain else use default pack.
  - **VALIDATION**: Before responding, verify every scenario has both login and logout steps -->
