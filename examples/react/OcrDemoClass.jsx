import { Component } from "react";
import { createWebOcr } from "webocr";

/**
 * React Class 组件
 *
 * npm i webocr
 * vite.config → plugins: [webocr()]
 */
export class OcrDemoClass extends Component {
  state = {
    status: "初始化中…",
    text: "",
    busy: false,
    ready: false,
  };

  _ocr = null;

  async componentDidMount() {
    try {
      this._ocr = await createWebOcr({
        onProgress: (p) => {
          this.setState({ status: `${p.message} (${p.percent}%)` });
        },
      });
      this.setState({
        ready: true,
        status: `就绪 · ${this._ocr.executionProvider}`,
      });
    } catch (err) {
      this.setState({
        status: err instanceof Error ? err.message : String(err),
      });
    }
  }

  componentWillUnmount() {
    this._ocr?.dispose();
    this._ocr = null;
  }

  onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !this._ocr) return;
    this.setState({ busy: true });
    try {
      const result = await this._ocr.recognize(file);
      this.setState({
        text: result.lines.map((l) => l.text).join("\n"),
      });
    } catch (err) {
      this.setState({
        status: err instanceof Error ? err.message : String(err),
      });
    } finally {
      this.setState({ busy: false });
    }
  };

  render() {
    const { status, text, busy, ready } = this.state;
    return (
      <div>
        <p>{status}</p>
        <input
          type="file"
          accept="image/*"
          disabled={busy || !ready}
          onChange={this.onFileChange}
        />
        <pre>{text}</pre>
      </div>
    );
  }
}
