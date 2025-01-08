export const getCroppedImg = async (imageSrc, pixelCrop) => {
  try {
    const image = new Image();
    image.src = imageSrc;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;

    // Crop the image
    canvas
      .getContext("2d")
      .drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        400,
        400
      );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        resolve(blob);
      }, "image/jpeg");
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};
