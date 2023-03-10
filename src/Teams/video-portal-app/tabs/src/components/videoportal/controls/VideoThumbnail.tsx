import { VideoInfo } from "../../../models/VideoInfo";

export function VideoThumbnail(props: {info : VideoInfo, onclick: Function}) {

  return (
    <span onClick={()=> props.onclick(props.info)}>
      <img src={props.info.thumbnail} style={{maxHeight: 200, marginRight: 5}}/>
    </span>
  );
}


