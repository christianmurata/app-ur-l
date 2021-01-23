const copy = (element: Element) => {
  const clear = () => window.getSelection()?.removeAllRanges();
  const addRange = (range: Range) => window.getSelection()?.addRange(range);

  clear();

  let range = document.createRange();
  range.selectNode(element);
  
  addRange(range);

  document.execCommand('copy');

  clear();
}

export default copy;