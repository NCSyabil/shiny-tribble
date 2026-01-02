# Amdocs CRM Test Prerequisites Setup Guide

## Test Case: ACRM_REG_001 - Customer Registration Prerequisites

### Environment Prerequisites

#### 1. Test Environment Access
- **AmdocsCRM Application URL**: Must be accessible and operational
- **Environment Type**: UAT/SIT environment with test data capabilities
- **Network Access**: VPN connection if required for internal systems
- **Browser Support**: Chrome/Firefox/Edge with JavaScript enabled

#### 2. Authentication Requirements
- **Microsoft SSO Setup**: 
  - Valid Azure AD credentials for test environment
  - MFA (Multi-Factor Authentication) configured and accessible
  - Required permissions: Customer Management, Service Administration
- **Session Management**: 
  - Test session name configured in environment variables
  - Session timeout settings appropriate for test duration

#### 3. User Permissions & Roles
- **Required Permissions**:
  - Customer Registration: Create, Read, Update
  - Service Management: Activate, Suspend, Modify
  - Billing Account: Link, View, Search
  - Search & Reports: Execute customer searches
- **Role Assignment**: Test user must have "Customer Service Representative" or "Administrator" role

### Data Prerequisites

#### 4. Test Data Setup
- **Valid Billing Accounts**: 
  - BA123456789 (Individual - Active)
  - BA987654321 (Individual - Active)  
  - BA555666777 (Business - Active)
- **Service Plans Available**:
  - Postpaid Plus (Mobile)
  - Fiber 100Mbps (Broadband)
  - Corporate Plan (Business Mobile)
- **Geographic Data**: Valid state/city/postal code combinations

#### 5. Environment Variables Configuration
Create/Update environment file: `environments/amdocscrm.env`
```env
# AmdocsCRM Environment Configuration
PLAYQ_ENV=amdocscrm
PLAYQ_RUNNER=cucumber

# Application URLs
env.url=https://amdocscrm-uat.company.com
env.session=amdocsCrmTestSession

# Authentication
env.crm_user=testuser@company.com
env.crm_password=TestPass123!

# Test Data
env.test_billing_account_1=BA123456789
env.test_billing_account_2=BA987654321
env.test_billing_account_3=BA555666777

# Browser Settings
PLAYQ__browser__browserType=chromium
PLAYQ__browser__headless=false
PLAYQ__testExecution__timeout=30000
```

#### 6. Static Variables Configuration
Update `resources/var.static.json`:
```json
{
  "amdocscrm": {
    "timeouts": {
      "page_load": 10000,
      "element_wait": 5000,
      "service_activation": 15000
    },
    "test_data": {
      "default_customer_type": "Individual",
      "default_service_type": "Mobile",
      "test_email_domain": "@testcompany.com"
    }
  }
}
```

### Technical Prerequisites

#### 7. PlayQ Framework Setup
- **Core Package**: @playq/core version 0.2.x or higher
- **AmdocsCRM Addon**: Installed and configured
- **Step Definitions**: AmdocsCRM step definitions imported in shim
- **Locators**: AmdocsCRM locator files configured

#### 8. Dependencies & Configuration
- **Node.js**: Version 18+ installed
- **NPM Packages**: All dependencies installed via `npm install`
- **Browser Drivers**: Playwright browsers installed via `npx playwright install`
- **Cucumber Config**: cucumber.js configured with AmdocsCRM profile

### Validation Steps

#### 9. Pre-Test Validation Checklist
- [ ] Environment URL accessible in browser
- [ ] Login credentials work manually in AmdocsCRM
- [ ] Test billing accounts exist and are active
- [ ] Required service plans are available for selection
- [ ] PlayQ framework installed and configured
- [ ] Environment variables properly set
- [ ] Browser automation working (simple navigation test)

#### 10. Quick Smoke Test
Run minimal validation before full test execution:
```bash
# Validate environment access
npx playq --runner cucumber --tags "@smoke" --env amdocscrm

# Test login only
npx playq --runner cucumber --tags "@login_only" --env amdocscrm
```

### Troubleshooting Common Issues

#### 11. Authentication Issues
- **MFA Problems**: Ensure authenticator app is accessible during test run
- **Permission Denied**: Verify user role has Customer Management permissions
- **Session Timeout**: Increase timeout values in config if needed

#### 12. Data Issues  
- **Billing Account Not Found**: Verify billing accounts exist in test environment
- **Service Plan Unavailable**: Check service catalog for active plans
- **Duplicate Customer**: Clear test data or use unique identifiers

#### 13. Technical Issues
- **Step Not Found**: Ensure AmdocsCRM step definitions are imported
- **Locator Failed**: Verify AmdocsCRM locator files are up to date
- **Timeout Errors**: Adjust timeout values for slower environments

### Post-Test Cleanup

#### 14. Test Data Cleanup (Optional)
- Customer records created during testing can be left for future reference
- Service activations should be documented for billing verification
- Test screenshots stored in `test-results/` for evidence

#### 15. Session Management
- Logout step ensures clean session termination
- Browser instances automatically closed by PlayQ framework
- Session variables cleared between test runs

---

**Note**: This prerequisites guide should be reviewed and updated based on actual AmdocsCRM environment configuration and organizational policies.