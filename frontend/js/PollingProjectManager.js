import { WidgetUtil } from '/js/utils/widgetUtil.js';
import { PopupUtil } from '/js/utils/popupUtil.js';

export class PollingProjectManager {
  constructor() {
    this.pollingProjectElement = document.getElementById("polling-project-widget");
    this.pollingProjectWidget = new WidgetUtil(this.pollingProjectElement, { width: 46 });
    const width = 46;
    this.popupUtil = new PopupUtil(width);
    this.jsonUrl = "/json/polling-project.json";
    this.popupJsonUrl = "/json/polling-project-popup.json";
  }
  
  async loadPopupContent() {
    try {
      const response = await fetch(this.popupJsonUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch popup content");
      }
      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error("Error fetching popup content:", error);
      return ["Error loading popup content"];
    }
  }
  
  async updatePollingData() {
    try {
      const response = await fetch(this.jsonUrl);
      const popupContent = await this.loadPopupContent();
      
      if (!response.ok) {
        throw new Error("Failed to fetch polling project");
      }
      const data = await response.json();
      this.updateWidget(data, popupContent);
    } catch (error) {
      console.error("Error fetching polling project:", error);
      this.updateWidget(null, ["Error loading content"]);
    }
  }

  updateWidget(data, popupContent) {
    if (data) {
      this.pollingProjectWidget.updateWidget(
        ...data.project.map(line => ({ content: line })),
        { 
          content: 'READ MORE', 
          url: data.url,
          popupContent: popupContent.join('\n'),
          onClick: async () => {
            this.popupUtil.open(popupContent);
          }
        }
      );
    } else {
      this.pollingProjectWidget.updateWidget(
        { content: "error loading link" }
      );
    }
  }

  init() {
    this.updatePollingData();
  }
}
