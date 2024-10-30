export class PopupUtil {
  constructor(width = 46) {
    this.popup = null;
    this.content = null;
    this.width = width;
    this.setupPopup();
  }

  setupPopup() {
    this.popup = document.createElement('div');
    this.popup.className = 'ascii-popup';
    this.popup.style.display = 'none';
    
    this.content = document.createElement('div');
    this.content.className = 'ascii-popup-content';
    
    this.popup.appendChild(this.content);
    document.body.appendChild(this.popup);
    
    this.popup.addEventListener('click', (e) => {
      if (e.target === this.popup) this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }

  formatContent(contentLines) {
    const border = '+' + '-'.repeat(this.width - 2) + '+';
    const formattedLines = contentLines.map(line => {
      const paddingTotal = this.width - 2 - line.length;
      const paddingLeft = Math.floor(paddingTotal / 2);
      const paddingRight = paddingTotal - paddingLeft;
      return '|' + ' '.repeat(paddingLeft) + line + ' '.repeat(paddingRight) + '|';
    });

    return [
      border,
      ...formattedLines,
      border
    ].join('\n');
  }

  open(contentLines) {
    const formattedContent = this.formatContent(contentLines);
    this.content.textContent = formattedContent;
    this.popup.style.display = 'flex';
    this.isOpen = true;
  }

  close() {
    this.popup.style.display = 'none';
    this.isOpen = false;
  }
}
