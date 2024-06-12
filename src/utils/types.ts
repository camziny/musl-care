export type ImageData = {
  url: string;
  altText: string;
};

export type CareGiver = {
  id: number;
  name: string;
  image: ImageData;
  description: string;
};
