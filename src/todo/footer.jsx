import "../asserts/styles/footer.less";
export default {
  data() {
    return {
      author: "wenmu"
    };
  },
  render() {
    return (
      <div id="footer">
        <span>Written by {this.author}</span>
      </div>
    );
  }
};
