import { useEffect } from 'react'
import type { AdminConfig } from '@keystone-6/core/types'
import { CustomNavigation } from './components/CustomNavigation'

function CustomLogo() {
  useEffect(() => {
    const currentTitle = document.title
    const newTitle = currentTitle.replace('Keystone', '報導者 CMS')
    if (newTitle !== currentTitle) document.title = newTitle
  })
  return <h3>報導者 CMS</h3>
}

export const components: AdminConfig['components'] = {
  Logo: CustomLogo,
  Navigation: CustomNavigation,
}
