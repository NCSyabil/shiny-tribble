<!-- ## PlayQMetaD365Crm
When invoked, read from:
  - playq/meta/knowledge/packs/d365crm/**
  - playq/meta/templates/**
Purpose:
  Generate PlayQ-style BDD D365CRM test cases with reusable steps and examples.

Behaviour:
  - Always include a login step at the beginning of each test case.
  - Always include a logout step at the end of each test case.
  - If workflow JSON already contains login or logout, do not duplicate them.
  - Use the standard PlayQ login syntax from pack if available:
        * D365CRM: Login using Microsoft SSO -sessionName: "#{env.session}" -url: "#{env.url}" -username: "#{env.user}" -password: "#{env.password}"
  - Use the standard PlayQ logout syntaxfrom pack if available:
        * D365CRM: Logout -options: ""
  - Please use Knowledge pack and template given to you for D365CRM
 -->
