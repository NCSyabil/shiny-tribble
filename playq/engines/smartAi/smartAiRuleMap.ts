export const smartDataRules = [
{
  type: 'button',
  rules: [
    // 🥇 Priority 10: Exact label or text match
    { priority: 10, match: (item, selector) => (item.tag === 'button' || item.type === 'button') && item.label?.toLowerCase() === selector.toLowerCase(), desc: 'R1: Exact label' },
    { priority: 10, match: (item, selector) => (item.tag === 'button' || item.type === 'button') && item.text?.toLowerCase() === selector.toLowerCase(), desc: 'R1.1: Exact text match' },

    // 🥈 Priority 15: Exact aria-label match
    { priority: 15, match: (item, selector) => (item.tag === 'button' || item.type === 'button') && item.attributes?.['aria-label']?.toLowerCase() === selector.toLowerCase(), desc: 'R2: Exact aria-label match' },

    // 🥉 Priority 20: Exact name match
    { priority: 20, match: (item, selector) => (item.tag === 'button' || item.type === 'button') && item.attributes?.['name']?.toLowerCase() === selector.toLowerCase(), desc: 'R3: Exact name match' },

    // 🎯 Priority 30: Partial label or text match
    { priority: 30, match: (item, selector) => (item.tag === 'button' || item.type === 'button') && (item.label?.toLowerCase().includes(selector.toLowerCase()) || item.text?.toLowerCase().includes(selector.toLowerCase())), desc: 'R4: Partial label or text match' },

    // 🔎 Priority 40: Partial aria-label match
    { priority: 40, match: (item, selector) => (item.tag === 'button' || item.type === 'button') && item.attributes?.['aria-label']?.toLowerCase().includes(selector.toLowerCase()), desc: 'R5: Partial aria-label match' },

    // 🔍 Priority 50: Partial name match
    { priority: 50, match: (item, selector) => (item.tag === 'button' || item.type === 'button') && item.attributes?.['name']?.toLowerCase().includes(selector.toLowerCase()), desc: 'R6: Partial name match' },

    // 🧩 Priority 60: Fallback - Exact type match
    { priority: 60, match: (item, selector) => (item.tag === 'button' || item.type === 'button') && item.attributes?.['type']?.toLowerCase() === selector.toLowerCase(), desc: 'R7: Exact type match' },

    // 🛡️ Priority 70: Fallback - Tag only match
    // { priority: 70, match: (item, selector) => (item.tag === 'button' || item.type === 'button'), desc: 'R8: Fallback - Tag only match' },
  ]
},
  {
  type: 'input',
  rules: [
    // 🥇 Priority 10: Exact label match (tag: input)
    { priority: 10, match: (item, selector) => (item.tag === 'input' || item.type === 'input') && item.label?.toLowerCase() === selector.toLowerCase(), desc: '[INPUT] R1: Exact label match' },

    // 🥈 Priority 15: Exact text match (tag: input)
    { priority: 15, match: (item, selector) => (item.tag === 'input' || item.type === 'input') && item.text?.toLowerCase() === selector.toLowerCase(), desc: '[INPUT] R2: Exact text match' },

    // 🥉 Priority 20: Exact aria-label match (tag: input)
    { priority: 20, match: (item, selector) => (item.tag === 'input' || item.type === 'input') && item.attributes?.['aria-label']?.toLowerCase() === selector.toLowerCase(), desc: '[INPUT] R3: Exact aria-label match' },

    // 🏅 Priority 30: Exact placeholder match (tag: input)
    { priority: 30, match: (item, selector) => (item.tag === 'input' || item.type === 'input') && item.attributes?.['placeholder']?.toLowerCase() === selector.toLowerCase(), desc: '[INPUT] R4: Exact placeholder match' },

    // 🎯 Priority 40: Exact name match (tag: input)
    { priority: 40, match: (item, selector) => (item.tag === 'input' || item.type === 'input') && item.attributes?.['name']?.toLowerCase() === selector.toLowerCase(), desc: '[INPUT] R5: Exact name match' },

    // 🔎 Priority 50: Partial label match (tag: input)
    { priority: 50, match: (item, selector) => (item.tag === 'input' || item.type === 'input') && item.label?.toLowerCase().includes(selector.toLowerCase()), desc: '[INPUT] R6: Partial label match' },

    // 🔍 Priority 60: Partial text match (tag: input)
    { priority: 60, match: (item, selector) => (item.tag === 'input' || item.type === 'input') && item.text?.toLowerCase().includes(selector.toLowerCase()), desc: '[INPUT] R7: Partial text match' },

    // 🧭 Priority 70: Partial aria-label match (tag: input)
    { priority: 70, match: (item, selector) => (item.tag === 'input' || item.type === 'input') && item.attributes?.['aria-label']?.toLowerCase().includes(selector.toLowerCase()), desc: '[INPUT] R8: Partial aria-label match' },

    // 🧩 Priority 80: Partial placeholder match (tag: input)
    { priority: 80, match: (item, selector) => (item.tag === 'input' || item.type === 'input') && item.attributes?.['placeholder']?.toLowerCase().includes(selector.toLowerCase()), desc: '[INPUT] R9: Partial placeholder match' },

    // 🧱 Priority 90: Partial name match (tag: input)
    { priority: 90, match: (item, selector) => (item.tag === 'input' || item.type === 'input') && item.attributes?.['name']?.toLowerCase().includes(selector.toLowerCase()), desc: '[INPUT] R10: Partial name match' },

    // 🛡️ Priority 100: Fallback - exact type match (tag: input)
    { priority: 100, match: (item, selector) => (item.tag === 'input' || item.type === 'input') && item.attributes?.['type']?.toLowerCase() === selector.toLowerCase(), desc: '[INPUT] R11: Exact type match' },

    // 🛡️ Priority 110: Fallback - tag match only (tag: input)
    // { priority: 110, match: (item, selector) => (item.tag === 'input' || item.type === 'input'), desc: 'R12: Fallback - input tag match' }
  ]
},
  {
  type: 'radio',
  rules: [
    // 🥇 Priority 10: Exact label + fieldset (section) match
    { priority: 10, match: (item, selector, opts) =>
        (item.tag === 'input' && item.type === 'radio') &&
        item.label?.toLowerCase() === selector.toLowerCase() &&
        (item.fieldset?.toLowerCase() === opts.section.toLowerCase()),
      desc: '[RADIO] R1: Exact label + fieldset (section) match'
    },

    // 🥈 Priority 15: Exact label match only
    { priority: 15, match: (item, selector) =>
        (item.tag === 'input' && item.type === 'radio') &&
        item.label?.toLowerCase() === selector.toLowerCase(),
      desc: '[RADIO] R2: Exact label match only'
    },

    // 🥉 Priority 20: Exact aria-label match
    { priority: 20, match: (item, selector) =>
        (item.tag === 'input' && item.type === 'radio') &&
        item.attributes?.['aria-label']?.toLowerCase() === selector.toLowerCase(),
      desc: '[RADIO] R3: Exact aria-label match'
    },

    // 🏅 Priority 30: Exact name match
    { priority: 30, match: (item, selector) =>
        (item.tag === 'input' && item.type === 'radio') &&
        item.attributes?.['name']?.toLowerCase() === selector.toLowerCase(),
      desc: '[RADIO] R4: Exact name match'
    },

    // 🎯 Priority 40: Partial label match
    { priority: 40, match: (item, selector) =>
        (item.tag === 'input' && item.type === 'radio') &&
        item.label?.toLowerCase().includes(selector.toLowerCase()),
      desc: '[RADIO] R5: Partial label match'
    },

    // 🔎 Priority 50: Partial aria-label match
    { priority: 50, match: (item, selector) =>
        (item.tag === 'input' && item.type === 'radio') &&
        item.attributes?.['aria-label']?.toLowerCase().includes(selector.toLowerCase()),
      desc: '[RADIO] R6: Partial aria-label match'
    },

    // 🔍 Priority 60: Partial name match
    { priority: 60, match: (item, selector) =>
        (item.tag === 'input' && item.type === 'radio') &&
        item.attributes?.['name']?.toLowerCase().includes(selector.toLowerCase()),
      desc: '[RADIO] R7: Partial name match'
    },

    // 🛡️ Priority 70: Fallback - exact type match
    { priority: 70, match: (item, selector) =>
        (item.tag === 'input' && item.type === 'radio') &&
        item.attributes?.['type']?.toLowerCase() === selector.toLowerCase(),
      desc: '[RADIO] R8: Exact type match'
    }
  ]
},
{
  type: 'checkbox',
  rules: [
    // 🥇 Priority 10: Exact label + fieldset (section) match
    { priority: 10, match: (item, selector, opts) =>
        (item.tag === 'input' && item.type === 'checkbox') &&
        opts.section &&
        item.label?.toLowerCase() === selector.toLowerCase() &&
        item.fieldset?.toLowerCase() === opts.section.toLowerCase(),
      desc: '[CHECKBOX] R1: Exact label + fieldset (section) match'
    },

    // 🥈 Priority 15: Exact label match only
    { priority: 15, match: (item, selector) =>
        (item.tag === 'input' && item.type === 'checkbox') &&
        item.label?.toLowerCase() === selector.toLowerCase(),
      desc: '[CHECKBOX] R2: Exact label match only'
    },

    // 🥉 Priority 20: Exact aria-label match
    { priority: 20, match: (item, selector) =>
        (item.tag === 'input' && item.type === 'checkbox') &&
        item.attributes?.['aria-label']?.toLowerCase() === selector.toLowerCase(),
      desc: '[CHECKBOX] R3: Exact aria-label match'
    },

    // 🏅 Priority 30: Exact name match
    { priority: 30, match: (item, selector) =>
        (item.tag === 'input' && item.type === 'checkbox') &&
        item.attributes?.['name']?.toLowerCase() === selector.toLowerCase(),
      desc: '[CHECKBOX] R4: Exact name match'
    },

    // 🎯 Priority 40: Partial label match
    { priority: 40, match: (item, selector) =>
        (item.tag === 'input' && item.type === 'checkbox') &&
        item.label?.toLowerCase().includes(selector.toLowerCase()),
      desc: '[CHECKBOX] R5: Partial label match'
    },

    // 🔎 Priority 50: Partial aria-label match
    { priority: 50, match: (item, selector) =>
        (item.tag === 'input' && item.type === 'checkbox') &&
        item.attributes?.['aria-label']?.toLowerCase().includes(selector.toLowerCase()),
      desc: '[CHECKBOX] R6: Partial aria-label match'
    },

    // 🔍 Priority 60: Partial name match
    { priority: 60, match: (item, selector) =>
        (item.tag === 'input' && item.type === 'checkbox') &&
        item.attributes?.['name']?.toLowerCase().includes(selector.toLowerCase()),
      desc: '[CHECKBOX] R7: Partial name match'
    },

    // 🛡️ Priority 70: Fallback - exact type match
    { priority: 70, match: (item, selector) =>
        (item.tag === 'input' && item.type === 'checkbox') &&
        item.attributes?.['type']?.toLowerCase() === selector.toLowerCase(),
      desc: '[CHECKBOX] R8: Exact type match'
    }
  ]
}, 
  {
    type: 'dropdown',
    rules: [
      { priority: 10, match: (item, selector) => item.tag === 'button' && item.text?.toLowerCase() === selector.toLowerCase(), desc: 'R1: type: button, Exact match: text/label' },
      { priority: 20, match: (item, selector) => item.tag === 'select', desc: 'R2: type: button, Partial match: text/label' },
    ]
  },
  {
    type: 'link',
    rules: [
      { priority: 10, match: (item, selector) => item.type === 'link' && item.text?.toLowerCase() === selector.toLowerCase(), desc: 'R1: type: button, Exact match: text/label' },
      { priority: 20, match: (item, selector) => item.tag === 'link', desc: 'R2: type: button, Partial match: text/label' },
    ]
  }
];