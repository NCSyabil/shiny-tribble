# GitHub CoPilot Instructions for PlayQ Framework

## Overview
PlayQ is an AI-driven test-automation framework based on Playwright + TypeScript.  
CoPilot should always suggest PlayQ-style test steps, commands, and BDD structures.

## Knowledge Packs
- All automation commands are defined under `playq/meta/knowledge/packs/`
  - **default** → generic PlayQ actions (click, wait, verify)
  - **d365crm** → Microsoft Dynamics CRM actions
  - **amdocscrm** → Amdocs CRM actions
  - **workday** → Workday HCM actions
- Each pack file (e.g. `playq-copilot-d365crm.json`) lists command `name`, `syntax`, `description`, and `example`.

When CoPilot generates steps, prefer commands from these packs.

## Templates
Use templates in `playq/meta/templates/` when generating complete test cases:
- **BDD template:** `testcase-bdd.md`


Each template uses PlayQ placeholders like `{{Domain}}`, `{{Module}}`, `{{Objective}}`, etc.

## Expected Output Format
CoPilot must follow this structure when generating PlayQ BDD test cases:




## PlayQ BDD Template Format
When generating PlayQ test cases (for D365CRM, AmdocsCRM, Workday, etc.), follow this exact structure:

Feature: <Domain> - <Module>
## Test Case: <Title>
# Test Case ID: <ID>
# Test Case Title: <Title>
# Module: <Module>
# Sub-Module: <SubModule>
# Objective: <Objective>
# Pre-Conditions:   - <Condition 1>
# Test Type: <Type>
# Priority: <Priority>
@<ID> @<Domain>_<ModuleTag> @priority:<PriorityTag>
Scenario Outline: <ScenarioTitle>
    * <Domain>: <Command> -Field:"..." -Text:"..." -Options:"..."
Examples:
  | Field1 | Field2 |
  | Value1 | Value2 |