
export function VideoIframe(props: {videoUniqueId: string, siteRootUrl : string, title : string}) {

  const url = `${props.siteRootUrl}/_layouts/15/embed.aspx?UniqueId=${props.videoUniqueId}&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create`
  return (
    <iframe src={url} width="640" height="360" allowFullScreen title={props.title}></iframe>
  );
  // <iframe src="https://m365x72460609-my.sharepoint.com/personal/admin_m365x72460609_onmicrosoft_com/_layouts/15/embed.aspx?UniqueId=864390a1-3de9-4d33-8996-5e086822d712&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create" width="640" height="360" frameborder="0" scrolling="no" allowfullscreen title="Rick Astley - Never Gonna Give You Up 4K 60 FPS Remastered.mp4"></iframe>
}


