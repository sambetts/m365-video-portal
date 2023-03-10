import { PlaylistVideoItemInfo } from "../../../models/SPListItemWrappersClasses";

export function VideoThumbnail(props: {info : PlaylistVideoItemInfo, onclick: Function}) {

  return (
    <span onClick={()=> props.onclick(props.info)}>
      <img src={props.info.thumbnail} style={{maxHeight: 200, marginRight: 5}} alt="Video Preview"/>
    </span>
  );
}


