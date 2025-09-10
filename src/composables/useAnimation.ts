export const useAnimation = () => {
  const animateElement = (selector: string, animationType: string) => {
    const element = document.querySelector(selector)
    if (!element) return
    
    element.classList.add(`animate-${animationType}`)
    
    setTimeout(() => {
      element.classList.remove(`animate-${animationType}`)
    }, 1000)
  }

  return {
    animateElement
  }
}