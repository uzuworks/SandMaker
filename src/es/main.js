document.addEventListener('DOMContentLoaded', async () => {
  const setting = await fetch('./json/setting.json').then(resp => resp.json());

  const button = document.querySelector('#sandStart');
  button.addEventListener('click', async () => {
    await createSand(setting);
  });

  await createSand(setting);
});

const createSand = async (setting) => {
  const context = document.querySelector('#sandContext');
  const components = getComponents(context.value, 0, setting.stacks);

  const canvas = document.querySelector('#sandCanvas');
  canvas.width = setting.width;
  canvas.height =
    setting.startShift + setting.endShift
    + components.reduce(((s, a) => s + a.height), 0);

  let h = canvas.height - setting.endShift;
  const ctx = canvas.getContext('2d');

  for (let i = components.length - 1; i >= 0; i--) {
    h = h - components[i].height;

    if (components[i].image) {
      await drawComponent(ctx, h, components[i].image);
    }
  }
}

const drawComponent = async (ctx, h, image) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      ctx.drawImage(img, 0, h);
      resolve(img);
    }
  });
}

const getComponents = (content, stacks_i, stacks) => {
  const splitedContents = content.split(stacks[stacks_i].keyword);
  let result = []
  for (let i = 0; i < splitedContents.length; i++) {
    if (stacks_i < stacks.length - 1) {
      const content = getComponents(splitedContents[i], stacks_i + 1, stacks);
      result = result.concat(content);
    }
    if (i < splitedContents.length - 1) {
      result = result.concat(stacks[stacks_i]);
    }
  }
  return result;

}
