const riskyUrlPattern = /^\s*(javascript|data:text\/html)/i
const allowlistedScriptHostnames = ['projects.twreporter.org']

function isAllowlistedScriptUrl(url: string): boolean {
  try {
    return allowlistedScriptHostnames.includes(new URL(url).hostname)
  } catch {
    return false
  }
}

export function mayContainRiskyScript(embeddedCode: string): boolean {
  const template = document.createElement('template')
  template.innerHTML = embeddedCode

  const scriptElements = Array.from(template.content.querySelectorAll('script'))
  const hasRiskyScript = scriptElements.some((scriptElement) => {
    const scriptSrc = scriptElement.getAttribute('src')
    return !scriptSrc || !isAllowlistedScriptUrl(scriptSrc)
  })

  if (hasRiskyScript) {
    return true
  }

  const elements = Array.from(template.content.querySelectorAll('*'))
  return elements.some((element) => {
    return Array.from(element.attributes).some((attribute) => {
      const attributeName = attribute.name.toLowerCase()
      const attributeValue = attribute.value

      return (
        attributeName.startsWith('on') ||
        (['href', 'src', 'xlink:href'].includes(attributeName) &&
          riskyUrlPattern.test(attributeValue)) ||
        attributeName === 'srcdoc'
      )
    })
  })
}

// This is an author trust check, not HTML sanitization.
export function confirmEmbeddedCodeTrust(embeddedCode: string): boolean {
  return (
    !mayContainRiskyScript(embeddedCode) ||
    window.confirm(
      '這段 Embedded Code 可能包含會執行的 script 或高風險 HTML 屬性。請確認來源可信任後再繼續。'
    )
  )
}
