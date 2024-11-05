// https://postsandprograms.com/posts/20210722/
showdown.extension("remove-p-from-img", function () {
  return [
    {
      type: "output",
      filter: function (text) {
        text = text.replace(
          // match all <p>'s before and after an <img> tag
          /(<\/?p[^>]*>)((?=<img.+>)|(?<=<img.+>))/g,
          ""
        );
        return text;
      },
    },
  ];
});

// Markdown to HTML converter with extensions and parameters
export var converter = new showdown.Converter({
  extensions: ["remove-p-from-img"],
  parseImgDimensions: true,
  openLinksInNewWindow: true,
  simpleLineBreaks: true,
});