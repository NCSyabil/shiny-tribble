(function (globalContext) {

function extractSmartLoc() {
  if (typeof document === 'undefined') {
    console.error("❌ smartAiLocScript.js: This script must be executed in a browser context (via page.evaluate).");
    return [];
  }
  // === Centralized Config Object ===
  const config = {
    allowedAttributeTags: [
      "id",
      "class",
      "aria-label",
      "aria-aria-selected",
      "role",
      "name",
      "placeholder",
      "value",
      "type"
    ],
    allowedOutputTags: [
      "input",
      "button",
      "select",
      "textarea",
      "a",
      "li",
      "span",
    ],
    strictXPath: false, // strict XPath generation (true: strict, false: relaxed)
    generateCss: true, // generate CSS selectors
    generateXpath: true, // generate XPath selectors
    positionOutput: false, // include position output in results
    hiddenElement: "flexible", // Options: "strict" | "flexible" | "off"
    skipEmptyElements: true, // Skip elements with empty text/label
    abbreviateKeys: true, // Enable/disable key abbreviation
  };
  // Helper function to abbreviate keys if config.abbreviateKeys is true
  function abbreviateKeys(obj) {
    const keyMap = { index: "i", parentIndex: "pi", tag: "tg", type: "tp", css: "cs", xpath: "xp", text: "tx", label: "lb", labelDetection: "ld", labelGroup: "lg", fieldset: "fs", attributes: "at", position: "pos" };
    const attributeKeyMap = { 'class': 'cl', 'id': 'id', 'role': 'rl', 'aria-label': 'al', 'name': 'nm', 'placeholder': 'ph','value': 'vl', 'type': 'tp', 'checked': 'ck'};

    const newObj = {};
    for (const key in obj) {
      if (key === 'attributes' && typeof obj[key] === 'object') {
        const attrs = {};
        for (const attrKey in obj[key]) {
          attrs[attributeKeyMap[attrKey] || attrKey] = obj[key][attrKey];
        }
        newObj[keyMap[key] || key] = attrs;
      } else {
        newObj[keyMap[key] || key] = obj[key];
      }
    }
    return newObj;
  }

  const typeMappingRules = {
    'input[type="email"]': "email",
    'input[type="password"]': "password",
    'input[type="checkbox"]': "checkbox",
    'input[type="radio"]': "radio",
    'input[type="submit"]': "submit",
    'input[type="file"]': "file",
    'input[type="date"]': "date",
    'input[type="time"]': "time",
    'input[type="color"]': "color",
    'input[type="range"]': "range",
    button: "button",
    a: "link",
    select: "dropdown",
    textarea: "textarea",
    '[role="dialog"]': "dialog",
    '[role="modal"]': "modal",
    '[role="tab"]': "tab",
    '[role="navigation"]': "navigation",
  };

  const customTypeRules = [
    // Existing rules
    {
      match: (el) =>
        el.tagName.toLowerCase() === "button" &&
        (el.getAttribute("aria-haspopup") || "").toLowerCase() === "listbox",
      type: "dropdown",
    },
    {
      match: (el) =>
        el.tagName.toLowerCase() === "a" &&
        (el.getAttribute("role") || "").toLowerCase() === "button",
      type: "button-link",
    },
    {
      match: (el) =>
        el.tagName.toLowerCase() === "div" &&
        (el.getAttribute("role") || "").toLowerCase() === "dialog",
      type: "dialog",
    },
    { match: (el) => isBreadcrumb(el), type: "breadcrumb" },

    // New rules 🎯
    {
      match: (el) =>
        el.tagName.toLowerCase() === "input" &&
        (el.getAttribute("role") || "").toLowerCase() === "combobox",
      type: "dropdown",
    },
    {
      match: (el) =>
        el.tagName.toLowerCase() === "input" &&
        (el.getAttribute("type") || "").toLowerCase() === "search",
      type: "search",
    },
    {
      match: (el) =>
        el.tagName.toLowerCase() === "input" &&
        (el.getAttribute("type") || "").toLowerCase() === "tel",
      type: "phone",
    },
    {
      match: (el) =>
        el.tagName.toLowerCase() === "input" &&
        (el.getAttribute("type") || "").toLowerCase() === "number",
      type: "number",
    },
    {
      match: (el) =>
        el.tagName.toLowerCase() === "input" &&
        (el.getAttribute("type") || "").toLowerCase() === "file",
      type: "file",
    },
    { match: (el) => (el.getAttribute("role") || "").toLowerCase() === "tablist", type: "tablist" },
    { match: (el) => (el.getAttribute("role") || "").toLowerCase() === "tab", type: "tab" },
    {
      match: (el) => (el.getAttribute("role") || "").toLowerCase() === "navigation",
      type: "navigation",
    },
    {
      match: (el) =>
        (el.getAttribute("aria-expanded") || "").toLowerCase() === "true" &&
        (el.getAttribute("role") || "").toLowerCase() === "menuitem",
      type: "menu",
    },
    {
      match: (el) => (el.getAttribute("aria-haspopup") || "").toLowerCase() === "menu",
      type: "menu-trigger",
    },
    { match: (el) => el.getAttribute("aria-pressed") !== null, type: "toggle" }, // For toggle buttons
    {
      match: (el) => el.getAttribute("aria-checked") !== null,
      type: "checkbox",
    }, // For ARIA checkboxes
    { match: (el) => el.getAttribute("aria-selected") !== null, type: "tab" }, // For ARIA tabs
    {
      match: (el) =>
        (el.getAttribute("aria-label") || "").toLowerCase() === "breadcrumb",
      type: "breadcrumb",
    },
    {
      match: (el) => (el.getAttribute("aria-autocomplete") || "").toLowerCase() === "list",
      type: "dropdown",
    },
    { match: (el) => (el.getAttribute("role") || "").toLowerCase() === "combobox", type: "dropdown" },
    {
      match: (el) => el.classList.contains("MuiAutocomplete-input"),
      type: "dropdown",
    },

    // Based on common classes
    {
      match: (el) =>
        el.classList.contains("btn") || el.classList.contains("button"),
      type: "button",
    },
      {
        match: (el) =>
        el.tagName.toLowerCase() === "input" &&
        ["submit", "button"].includes((el.getAttribute("type") || "").toLowerCase()),
        type: "button",
    },
    {
      match: (el) =>
        el.classList.contains("dropdown") ||
        el.classList.contains("select2-container"),
      type: "dropdown",
    },
    {
      match: (el) =>
        el.classList.contains("modal") || el.classList.contains("popup"),
      type: "dialog",
    },
    {
      match: (el) =>
        el.classList.contains("tab") || el.classList.contains("tab-link"),
      type: "tab",
    },
  ];

  function isBreadcrumb(el) {
    let current = el;
    while (current) {
      const tag = current.tagName?.toLowerCase();
      const role = current.getAttribute("role")?.toLowerCase();
      const aria = current.getAttribute("aria-label")?.toLowerCase();

      if (
        (tag === "ol" && current.classList.contains("breadcrumb")) ||
        (tag === "nav" && aria === "breadcrumb") ||
        (role === "navigation" && aria === "breadcrumb")
      ) {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  }

  //   function getCssSelector(el) {
  //     if (el.id) return `#${el.id}`;
  //     let path = [];
  //     while (el && el.nodeType === 1) {
  //       let selector = el.nodeName.toLowerCase();
  //       if (el.className) selector += '.' + Array.from(el.classList).join('.');
  //       const siblings = Array.from(el.parentNode?.children || []).filter(n => n.nodeName === el.nodeName);
  //       if (siblings.length > 1) selector += `:nth-of-type(${siblings.indexOf(el) + 1})`;
  //       path.unshift(selector);
  //       el = el.parentElement;
  //     }
  //     return path.join(' > ');
  //   }

  // function getCssSelector(el) {
  //   if (el.id) return `#${CSS.escape(el.id)}`;
  //   let selector = el.tagName.toLowerCase();
  //   const classList = el.className?.trim().split(/\s+/).filter(Boolean) || [];
  //   if (classList.length) {
  //     selector += "." + classList.join(".");
  //   }
  //   const parent = el.parentElement;
  //   if (parent) {
  //     const siblings = Array.from(parent.querySelectorAll(selector));
  //     if (siblings.length > 1) {
  //       const index = siblings.indexOf(el) + 1;
  //       selector += `:nth-of-type(${index})`;
  //     }
  //     const parentSelector = getCssSelector(parent);
  //     return `${parentSelector} > ${selector}`;
  //   }
  //   return selector;
  // }

  function getCssSelector(el) {
    if (el.id) return `#${CSS.escape(el.id)}`;

    let selector = el.tagName.toLowerCase();
    const classes = Array.from(el.classList).filter(cl => cl && cl.length < 20); // Skip long/generic classes

    if (classes.length > 0) selector += `.${classes.join('.')}`;

    const parent = el.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(e =>
        e.tagName.toLowerCase() === el.tagName.toLowerCase() &&
        e.className === el.className
      );
      if (siblings.length > 1) {
        selector += `:nth-of-type(${siblings.indexOf(el) + 1})`;
      }

      const parentIdOrClass = parent.id
        ? `#${CSS.escape(parent.id)}`
        : parent.classList.length > 0
          ? `${parent.tagName.toLowerCase()}.${Array.from(parent.classList).join('.')}`
          : parent.tagName.toLowerCase();

      return `${parentIdOrClass} > ${selector}`;
    }

    return selector;
  }

  function getXPath(el) {
    const getElementIdx = (sibling, name) =>
      Array.from(sibling.parentNode.children)
        .filter((n) => n.nodeName.toLowerCase() === name)
        .indexOf(sibling) + 1;

    const segments = [];
    while (el && el.nodeType === 1) {
      const name = el.nodeName.toLowerCase();
      const index = getElementIdx(el, name);
      segments.unshift(`${name}[${index}]`);
      el = el.parentElement;
    }
    return "/" + segments.join("/");
  }

  function getType(el) {
    // 🥇 Check if any parent is a breadcrumb container
    let parent = el;
    while (parent) {
      if (isBreadcrumb(parent)) return "breadcrumb";
      parent = parent.parentElement;
    }

    // 🥈 Check custom rules (higher priority)
    for (const rule of customTypeRules) {
      if (rule.match(el)) return rule.type;
    }

    // 🥉 Check CSS type mapping rules
    for (const [selector, mappedType] of Object.entries(typeMappingRules)) {
      try {
        if (el.matches(selector)) return mappedType;
      } catch (e) {
        // Silently ignore invalid selectors
      }
    }

    // 🏁 Fallback logic based on tag and attributes
    const tag = el.tagName.toLowerCase();
    const typeAttr = (el.getAttribute("type") || "").toLowerCase();

    if (tag === "input") {
      // if (typeAttr) return typeAttr; // Return specific input type if available
      // return "text"; // Default input type
      return "input"; // Always return "input" as type for inputs
    }

    if (tag === 'li' || tag === 'span') {
      return 'text';
    }

    return tag; // Return tag name for other elements
  }

  function getLabelText(el) {
    const tag = el.tagName.toLowerCase();
    let labelText = "";

    // 1. label[for=id]
    const id = el.getAttribute("id");
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label?.textContent?.trim()) return { text: label.textContent.trim(), mode: "safe" };
    }

    // 2. Radio buttons: custom handling
    if (tag === "input" && el.type === "radio") {
      const radioLabel = getLabelForRadio(el);
      if (typeof radioLabel === "string") {
        return { text: radioLabel, mode: "proximity" };
      } else if (radioLabel?.text) {
        return radioLabel;
      }
    }

    // 3. aria-labelledby
    const ariaLabelledBy = el.getAttribute("aria-labelledby");
    if (ariaLabelledBy) {
      const labelEl = document.getElementById(ariaLabelledBy);
      if (labelEl?.textContent?.trim()) return { text: labelEl.textContent.trim(), mode: "safe" };
    }

    // 4. aria-label
    const ariaLabel = el.getAttribute("aria-label");
    if (ariaLabel?.trim()) return { text: ariaLabel.trim(), mode: "safe"};

    // 5. Wrapped in <label>
    if (el.parentElement?.tagName.toLowerCase() === "label") {
      const labelSpan = el.parentElement.querySelector("span");
      if (labelSpan?.textContent?.trim()) return labelSpan.textContent.trim();
      if (el.parentElement.textContent?.trim()) return { text: el.parentElement.textContent.trim(), mode: "proximity"}  ;
    }

    // 6. Closest label with span or text
    const parentLabel = el.closest("label");
    if (parentLabel) {
      const spans = parentLabel.querySelectorAll("span");
      for (const s of spans) {
        if (s !== el && s.textContent?.trim()) return s.textContent.trim();
      }
      if (parentLabel.textContent?.trim()) return { text: parentLabel.textContent.trim(), mode: "proximity"};
    }

    // 7. Nearby label in DOM containers
    let parent = el.closest("div, span, section, td, form, fieldset");
    while (parent) {
      const possibleLabel = parent.querySelector("label");
      if (possibleLabel && (
        possibleLabel.contains(el) ||
        possibleLabel.nextElementSibling === el ||
        possibleLabel.previousElementSibling === el
      )) {
        return { text: possibleLabel.textContent.trim(), mode: "proximity"} ;
      }
      parent = parent.parentElement;
    }

    // 8. Submit/Button fallback
    if (tag === "input" && (el.type === "submit" || el.type === "button")) {
      return { text: el.value || "", mode: "safe" };
    }

    // 9. Last fallback: placeholder or name
    const placeholder = el.getAttribute("placeholder");
    if (placeholder?.trim()) return { text: placeholder.trim(), mode: "safe" } ;

    const name = el.getAttribute("name");
    if (name?.trim()) return { text: name.trim(), mode: "safe" };
    
    return { text: "", mode: "" };

  }

  // function getLabelText(el) {
  //   const tag = el.tagName.toLowerCase();
  //   let labelText = "";

  //   // Check label[for=id]
  //   const id = el.getAttribute("id");
  //   if (id) {
  //     const label = document.querySelector(`label[for="${id}"]`);
  //     if (label) return label.textContent.trim();
  //   }

  //    // Fallback: For radio, also check fieldset-legend
  //   if (tag === "input" && el.type === "radio") {
  //     const radioLabel = getLabelForRadio(el);
  //     if (radioLabel) return radioLabel;
  //   }

  //   // Check aria-labelledby
  //   const ariaLabelledBy = el.getAttribute("aria-labelledby");
  //   if (ariaLabelledBy) {
  //     const labelEl = document.getElementById(ariaLabelledBy);
  //     if (labelEl) return labelEl.textContent.trim();
  //   }

  //   // Check nearby label in parent containers
  //   let parent = el.closest("div, span, section, td, form, fieldset");
  //   while (parent) {
  //     const possibleLabel = parent.querySelector("label");
  //     if (possibleLabel) {
  //       if (
  //         possibleLabel.contains(el) ||
  //         possibleLabel.nextElementSibling === el ||
  //         possibleLabel.previousElementSibling === el
  //       ) {
  //         return possibleLabel.textContent.trim();
  //       }
  //     }
  //     parent = parent.parentElement;
  //   }

  //   // Fallback: For input[type="submit"] or input[type="button"], use value as label
  //   if (tag === "input" && (el.type === "submit" || el.type === "button")) {
  //     labelText = el.value || "";
  //   }

  //   return labelText;
  // }

function getGroupLabel(el) {
  let groupContainer = el.closest('[role="radiogroup"]');
  if (groupContainer) {
    const labelId = groupContainer.getAttribute('aria-labelledby');
    if (labelId) {
      const labelEl = document.getElementById(labelId);
      if (labelEl?.textContent?.trim()) {
        return labelEl.textContent.trim();
      }
    }
  }
  return "";
}

function getLabelForRadio(el) {
  // Case 1: label[for=id]
  const id = el.getAttribute("id");
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label?.textContent?.trim()) {
      return { text: label.textContent.trim(), mode: "safe" };
    }
  }

  // Case 2: Wrapped inside a label with nearby text
  const labelWrapper = el.closest("label");
  if (labelWrapper) {
    const spans = labelWrapper.querySelectorAll("span");
    for (const s of spans) {
      if (s !== el && s.textContent?.trim()) {
        return { text: s.textContent.trim(), mode: "proximity" };
      }
    }
    if (labelWrapper.textContent?.trim()) {
      return { text: labelWrapper.textContent.trim(), mode: "proximity" };
    }
  }

  // Case 3: Inside a fieldset > legend
  let parent = el.parentElement;
  while (parent) {
    if (parent.tagName.toLowerCase() === "fieldset") {
      const legend = parent.querySelector("legend");
      if (legend?.textContent?.trim()) {
        return { text: legend.textContent.trim(), mode: "proximity" };
      }
    }
    parent = parent.parentElement;
  }

  return null; // No label found
}

  function getFieldsetLabel(el) {
    let parent = el.parentElement;
    while (parent) {
      if (parent.tagName.toLowerCase() === "fieldset") {
        const legend = parent.querySelector("legend");
        if (legend) {
          return legend.textContent.trim();
        }
      }
      parent = parent.parentElement;
    }
    return undefined;
  }

  const allNodes = Array.from(document.querySelectorAll("*"));
  const elements = [];

  allNodes.forEach((el, index) => {
    const tag = el.tagName.toLowerCase();
    const rect = el.getBoundingClientRect();
    // const labelText = getLabelText(el);
    const labelResult = getLabelText(el) || {};
    const labelText = typeof labelResult === 'object' ? labelResult.text || "" : "";
    const labelDetectionMode = typeof labelResult === 'object' ? labelResult.mode || "" : "";

    // if (typeof labelResult === "object" && labelResult !== null) {
    //   elementObj.label = labelResult.text;
    //   elementObj.labelDetection = labelResult.mode;
    // } else if (typeof labelResult === "string" && labelResult.trim()) {
    //   elementObj.label = labelResult;
    // }

    

    if (config.allowedOutputTags.length > 0 && !config.allowedOutputTags.includes(tag)) return;

    if (config.hiddenElement !== "off") {
      const style = getComputedStyle(el);
      if (
        (config.hiddenElement === "strict" && (!rect.width || !rect.height)) ||
        (config.hiddenElement === "flexible" && (style.display === "none" || style.visibility === "hidden"))
      ) return;
    }

    const attributes = {};
    Array.from(el.attributes).forEach((attr) => {
      if (config.allowedAttributeTags.includes(attr.name)) {
        attributes[attr.name] = attr.value;
      }
    });

    // Add 'checked' attribute for radio buttons if checked
    if (el.tagName.toLowerCase() === "input" && el.getAttribute("type") === "radio") {
      if (el.checked) {
        attributes.ck = true; // Or use 'checked' if abbreviateKeys is false
      }
    }

    // === Add checked state for radio/checkbox ===
    if (el.tagName.toLowerCase() === "input") {
      const inputType = el.getAttribute("type")?.toLowerCase();
      if ((inputType === "radio" || inputType === "checkbox") && el.checked) {
        attributes["checked"] = true;
      }
    }

    const elementObj = {
      index,
      parentIndex: allNodes.indexOf(el.parentElement),
      tag,
      type: getType(el),
      css: config.generateCss ? getCssSelector(el) : "",
      xpath: config.generateXpath ? getXPath(el) : "",
      text: el.textContent?.trim() || "",
      label: labelText,
      labelDetection: labelDetectionMode, // Add label detection mode
      labelGroup: (tag === "input" && el.type === "radio") ? getGroupLabel(el) : undefined,
      fieldset: (tag === "input" && el.type === "radio") ? getFieldsetLabel(el) : undefined,
      attributes,
    };

    if (config.positionOutput) {
      elementObj.position = { x: rect.left, y: rect.top };
    }

    // Optional skip empty elements based on config
    const isFormElement = ["input", "select", "textarea"].includes(tag);
    if (config.skipEmptyElements && !isFormElement && !elementObj.text && !elementObj.label) return;

    // Abbreviation & cleanup
    let cleanedElementObj = config.abbreviateKeys ? abbreviateKeys(elementObj) : elementObj;
    cleanedElementObj = Object.fromEntries(
      Object.entries(cleanedElementObj).filter(([_, v]) => v !== undefined && v !== "")
    );

    elements.push(cleanedElementObj);
  });
  // allNodes.forEach((el, index) => {
  //   const tag = el.tagName.toLowerCase();
  //   const rect = el.getBoundingClientRect();

  //   if (
  //     config.allowedOutputTags.length > 0 &&
  //     !config.allowedOutputTags.includes(tag)
  //   )
  //     return;

  //   if (config.hiddenElement !== "off") {
  //     const style = getComputedStyle(el);
  //     if (
  //       (config.hiddenElement === "strict" && (!rect.width || !rect.height)) ||
  //       (config.hiddenElement === "flexible" &&
  //         (style.display === "none" || style.visibility === "hidden"))
  //     ) {
  //       return;
  //     }
  //   }
  //   const attributes = {};
  //   // === Label Lookup ===
  //   const labelText = getLabelText(el);

  //   Array.from(el.attributes).forEach((attr) => {
  //     if (config.allowedAttributeTags.includes(attr.name)) {
  //       attributes[attr.name] = attr.value;
  //     }
  //   });

  //   // Build the element object conditionally
  //   const elementObj = {
  //     index,
  //     parentIndex: allNodes.indexOf(el.parentElement),
  //     tag,
  //     type: getType(el),
  //     css: config.generateCss ? getCssSelector(el) : "",
  //     xpath: config.generateXpath ? getXPath(el) : "",
  //     text: el.textContent?.trim() || "",
  //     label: labelText,
  //     attributes,
  //   };
  //   if (config.positionOutput) {
  //     elementObj.position = { x: rect.left, y: rect.top };
  //   }
  //   // Remove undefined or empty fields
  //   let cleanedElementObj = Object.fromEntries(
  //     Object.entries(elementObj).filter(([_, v]) => v !== undefined && v !== "")
  //   );

  //   // Optional skip empty elements based on config
  //   // if (config.skipEmptyElements && !cleanedElementObj.text && !cleanedElementObj.label) return;
  //   if (config.skipEmptyElements) {
  //     const tag = cleanedElementObj.tg;
  //     const isFormElement = ["input", "select", "textarea"].includes(tag);

  //     if (!isFormElement && !cleanedElementObj.text && !cleanedElementObj.label) {
  //       return; // Skip empty non-form elements
  //     }
  //   }
  //   // Abbreviate keys if enabled
  //   let finalElementObj = config.abbreviateKeys ? abbreviateKeys(cleanedElementObj) : cleanedElementObj;

  //   // Clean again after abbreviation to remove empty string/undefined keys
  //   finalElementObj = Object.fromEntries(
  //     Object.entries(finalElementObj).filter(([_, v]) => v !== undefined && v !== "")
  //   );

  //   elements.push(finalElementObj);
  // });
  const output = JSON.stringify(elements, null, 2);
  if (typeof navigator !== 'undefined' && navigator.clipboard && document.hasFocus && document.hasFocus()) {
  navigator.clipboard
    .writeText(output)
    .then(() => {
      console.log("✅ DOM data copied to clipboard");
    })
    .catch((err) => console.warn("⚠️ Clipboard write failed. Likely due to browser restrictions."));
} else {
  console.warn("⚠️ Clipboard API not available or page not focused. Skipping copy to clipboard.");
}

  console.log("📋 Extracted DOM Elements:", elements);
  return elements;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { extractSmartLoc };
} else {
  globalContext.extractSmartLoc = extractSmartLoc;
}

})(typeof window !== "undefined" ? window : globalThis);

// Expose the function directly for Playwright evaluate context
// return (typeof extractSmartIQ !== 'undefined') ? extractSmartIQ() : [];