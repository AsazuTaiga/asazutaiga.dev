export const generateOgpUrl = (title: string) => {
  const encoded = encodeURI(title)
  return `https://res.cloudinary.com/dtouqmixu/image/upload/s--KghSoe3v--/c_fit,g_north_west,l_text:NotoSansJP.otf_90:${encoded},w_1120,x_50,y_50/v1628769914/ogp_base_riirui.png`
}
