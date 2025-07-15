
  // For select
 export const templateOptions = [
    {
      label: "Swatch",
      value: "Swatch",
      options: [
        { label: "Color", value: "Color" },
        { label: "Image", value: "Image" }
      ]
    },
    {
      label: "Button",
      value: "Button",
      options: [
        { label: "Text", value: "Text" },
        { label: "Image and text", value: "ImageText" }
      ]
    },
    {
      label: "Dropdown",
      value: "Dropdown",
      options: [
        { label: "Color and text", value: "ColorText" },
        { label: "Image and text", value: "ImageText" }
      ]
    }
  ];

  
export const positionMap: Record<string, string> = {
    "home-page": "Home page",
    "collection-page": "Collection page",
    "product-page": "Product page"
  };