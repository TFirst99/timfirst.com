import { WidgetUtil } from "/js/utils/widgetUtil.js";

export class SimulationProjectManager {
  constructor() {
    this.simulationProjectElement = document.getElementById(
      "simulation-project-widget",
    );
    this.simulationProjectWidget = new WidgetUtil(
      this.simulationProjectElement,
      {
        width: 46,
      },
    );
    this.jsonUrl = "/json/simulation-project.json";
  }

  async updateSimulationData() {
    try {
      const response = await fetch(this.jsonUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch simulation project");
      }
      const data = await response.json();
      this.updateWidget(data);
    } catch (error) {
      console.error("Error fetching simulation project:", error);
      this.updateWidget(null);
    }
  }

  updateWidget(data) {
    if (data) {
      this.simulationProjectWidget.updateWidget(
        ...data.project.map((line) => ({ content: line })),
        {
          content: "VIEW ON GITHUB",
          url: data.url,
        },
      );
    } else {
      this.simulationProjectWidget.updateWidget({
        content: "error loading link",
      });
    }
  }

  init() {
    this.updateSimulationData();
  }
}
