import carInfo from './carInfo/index'
import address from './address/index'
import ocr from './ocr/index'
import loading from './loading'
const components = {
  carInfo,
  address,
  ocr,
  loading
}


export default {
  install: function (Vue) {
    Object.keys(components).forEach(component  => {
      Vue.component(components[component].name, components[component])
    })
  }
}

export {
  carInfo,
  address,
  ocr,
  loading
}