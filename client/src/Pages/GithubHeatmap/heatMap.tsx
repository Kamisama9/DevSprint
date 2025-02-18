import { useEffect, useRef } from "react";
import CalHeatmap from "cal-heatmap";
// @ts-expect-error cal-heatmap library don't have declration files :(
import Tooltip from "cal-heatmap/plugins/Tooltip";
// @ts-expect-error cal-heatmap library don't have declration files :(
import LegendLite from "cal-heatmap/plugins/LegendLite";
// @ts-expect-error cal-heatmap library don't have declration files :(
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";
import 'cal-heatmap/cal-heatmap.css';
import dayjs from "dayjs";

const Heatmap = () => {
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (calRef.current) {
      const cal = new CalHeatmap();

      cal.paint(
        {
          itemSelector: calRef.current, // Attach to the div
          data: {
            source: "../fixtures/seattle-weather.csv",
            type: "csv",
            x: "date",
            y: (d: any) => +d["temp_max"],
            groupY: "max",
          },
          date: { start: new Date("2024-01-01") },
          range: 12,
          scale: {
            color: {
              type: "threshold",
              range: ["#14432a", "#166b34", "#37a446", "#4dd05a"],
              domain: [10, 20, 30],
            },
          },
          domain: {
            type: "month",
            gutter: 4,
            label: { text: "MMM", textAlign: "start", position: "top" },
          },
          subDomain: { type: "ghDay", radius: 2, width: 11, height: 11, gutter: 4 },
        },
        [
          [
            Tooltip,
            {
              text: function (date: Date, value: any, dayjsDate: any) {
                return (
                  (value ? value : "No") + " contributions on " + dayjsDate.format("dddd, MMMM D, YYYY")
                );
              },
            },
          ],
          [
            LegendLite,
            {
              includeBlank: true,
              itemSelector: "#ex-ghDay-legend",
              radius: 2,
              width: 11,
              height: 11,
              gutter: 4,
            },
          ],
          [
            CalendarLabel,
            {
              width: 30,
              textAlign: "start",
              text: () => dayjs.weekdaysShort().map((d, i) => (i % 2 == 0 ? "" : d)),
              padding: [25, 0, 0, 0],
            },
          ],
        ]
      );
    }
  }, []);

  return (
    <div
      style={{
        background: "#22272d",
        color: "#adbac7",
        borderRadius: "3px",
        padding: "1rem",
        overflow: "hidden",
      }}
    >
      <div ref={calRef} id="ex-ghDay" className="margin-bottom--md"></div>
      <div style={{ float: "right", fontSize: 12 }}>
        <span style={{ color: "#768390" }}>Less</span>
        <div id="ex-ghDay-legend" style={{ display: "inline-block", margin: "0 4px" }}></div>
        <span style={{ color: "#768390", fontSize: 12 }}>More</span>
      </div>
    </div>
  );
};

export default Heatmap;
