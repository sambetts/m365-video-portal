import { VideoInfo } from "../../../models/VideoInfo";

export function VideoThumbnail(props: {info : VideoInfo}) {

  return (
    <a onClick={()=> alert('Sup')}>
      <img src={props.info.thumbnail}/>
    </a>
  );
}


