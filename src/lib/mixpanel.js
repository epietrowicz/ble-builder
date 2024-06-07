import mixpanel from 'mixpanel-browser'
mixpanel.init(import.meta.env.VITE_PUBLIC_MIXPANEL_TOKEN)

const envCheck = process.env.NODE_ENV === 'production'

export const track = (trackingString) => {
  try {
    if (envCheck) {
      mixpanel.track(trackingString)
    }
  } catch (e) {
    console.log(e)
  }
}
