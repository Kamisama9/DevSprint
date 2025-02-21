import CalHeatmap from 'cal-heatmap';
import 'cal-heatmap/cal-heatmap.css';


const Heatmap = () => {
  //@ts-ignore
  const cal = new CalHeatmap();
  cal.paint({domain:{type:'year'},subDomain: { type: 'day',label:'DD'}});
  return (
    <div id="cal-heatmap"></div>
  )
}

export default Heatmap;
