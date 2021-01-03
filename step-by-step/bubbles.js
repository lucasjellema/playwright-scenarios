
// https://codingislove.com/css-speech-bubbles/
// LU left under RU right under LA left above and RA right above
const plotBubble = async function (page, selector, text, alignType = "LU", positionCorrection = {left:0, top:0}, autoRemoveDelay=-1) {
    await page.addStyleTag({ content: bubblesStyles })
    const targetEl = await page.$(selector)
    const parent = await page.$('body')
    const bubble = await page.evaluate((args) => {
        const alignmentMap = {"LU":"sb1","RU":"sb2","LA":"sb3","RA":"sb4"}
        const div = document.createElement('div');
        div.classList.add('bubblebox');
        div.classList.add(alignmentMap[args.alignType]);
        div.innerText = args.text
        args.parent.appendChild(div);
        let bodyRect = document.body.getBoundingClientRect(),
            elemRect = args.targetEl.getBoundingClientRect(),
            offsetTop = elemRect.top - bodyRect.top,
            offsetLeft = elemRect.left - bodyRect.left;

        div.style.left = `${offsetLeft + args.positionCorrection.left}px`
        div.style.top = `${offsetTop + args.positionCorrection.top}px`
        if (args.autoRemoveDelay>0) {
            setTimeout(() => {console.log(`removing div ${div}`);div.remove()}, args.autoRemoveDelay)
        }
        return div
    }, ({ parent, targetEl, text, alignType, positionCorrection, autoRemoveDelay }))
    return bubble
}

exports.plotBubble = plotBubble

const bubbleBackgroundColor = '#00bfb6'
const bubblesStyles = `
  .bubblebox {
    margin: 0px;
    padding: 0px;
    width: 300px;
    margin: 50px auto;
    background: ${bubbleBackgroundColor};
    padding: 20px;
    text-align: center;
    font-weight: 900;
    color: #fff;
    font-family: arial;
    position: absolute;
    z-index:300
  }
  
  .sb1:before {
    content: "";
    width: 0px;
    height: 0px;
    position: absolute;
    border-left: 10px solid  ${bubbleBackgroundColor};
    border-right: 10px solid transparent;
    border-top: 10px solid  ${bubbleBackgroundColor};
    border-bottom: 10px solid transparent;
    right: -19px;
    top: 6px;
  }
  
  .sb2:before {
    content: "";
    width: 0px;
    height: 0px;
    position: absolute;
    border-left: 10px solid transparent;
    border-right: 10px solid  ${bubbleBackgroundColor};
    border-top: 10px solid  ${bubbleBackgroundColor};
    border-bottom: 10px solid transparent;
    left: -19px;
    top: 6px;
  }
  
  .sb3:before {
    content: "";
    width: 0px;
    height: 0px;
    position: absolute;
    border-left: 10px solid  ${bubbleBackgroundColor};
    border-right: 10px solid transparent;
    border-top: 10px solid  ${bubbleBackgroundColor};
    border-bottom: 10px solid transparent;
    left: 19px;
    bottom: -19px;
  }
  
  .sb4:before {
    content: "";
    width: 0px;
    height: 0px;
    position: absolute;
    border-left: 10px solid transparent;
    border-right: 10px solid  ${bubbleBackgroundColor};
    border-top: 10px solid  ${bubbleBackgroundColor};
    border-bottom: 10px solid transparent;
    right: 19px;
    bottom: -19px;
  }`