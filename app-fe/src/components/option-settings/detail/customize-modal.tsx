import { useState, type FC } from "react";
import { Modal, Text, Select, Button, Card, ColorPicker, type HSBColor } from "@shopify/polaris";
import type { OptionSetting } from "@/models/common/setting.model";
import { ColorProvider } from "@/utils/color-provider";

interface CustomizeModalProps {
  open: boolean;
  onClose: () => void;
  option: OptionSetting | undefined;
  setOption: (option: Partial<OptionSetting>) => void;
}

type ColorType = "defaultColor" | "selectedColor" | "hoverColor" | "strikeColor";

const COLOR_LABELS: Record<ColorType, string> = {
  defaultColor: "Default color",
  selectedColor: "Selected color",
  hoverColor: "Hover color",
  strikeColor: "Strike color"
};

const getInitialColor = (type: ColorType, option?: OptionSetting) => {
  if (type === "strikeColor") {
    return ColorProvider.hexToHsba(option?.animation?.strikeColor ?? "#D9D9D9");
  }
  return ColorProvider.hexToHsba(option?.appearance?.[type] ?? "#D9D9D9");
};

const ColorSwatch: FC<{
  color: HSBColor;
  onClick: () => void;
}> = ({ color, onClick }) => (
  <div
    onClick={onClick}
    className='w-6 h-6 rounded-full relative border border-gray-300 cursor-pointer'
    style={{ background: ColorProvider.rgbToHex(ColorProvider.hsbToRgb(color)) }}
  ></div>
);

const ColorPickerPopover: FC<{
  color: HSBColor;
  onChange: (color: HSBColor) => void;
  open: boolean;
  onClose: () => void;
  left?: number;
  top?: number;
}> = ({ color, onChange, open, onClose, left = 0, top = 0 }) => (
  <div
    onMouseLeave={onClose}
    className='absolute z-50 pb-2 pt-2 pl-2 pr-2 bg-white rounded-md border border-gray-200'
    style={{ display: open ? "block" : "none", left, top }}
  >
    <ColorPicker color={color} onChange={onChange} />
  </div>
);

export const CustomizeModal: FC<CustomizeModalProps> = ({ open, onClose, option, setOption }) => {
  // Appearance state
  const [appearance, setAppearance] = useState({
    height: option?.appearance?.height ?? "100%",
    width: option?.appearance?.width ?? "100%",
    borderRadius: option?.appearance?.borderRadius ?? "0",
    spacing: option?.appearance?.spacing ?? "0",
    defaultColor: getInitialColor("defaultColor", option),
    selectedColor: getInitialColor("selectedColor", option),
    hoverColor: getInitialColor("hoverColor", option)
  });
  // Animation state
  const [animation, setAnimation] = useState({
    hoverAnimation: option?.animation?.hoverAnimation ?? "label",
    outOfStock: option?.animation?.outOfStock ?? "strike-out",
    strikeColor: getInitialColor("strikeColor", option)
  });
  // Only one color picker open at a time
  const [openColorPicker, setOpenColorPicker] = useState<ColorType | null>(null);

  // Generalized color change handler
  const handleColorChange = (type: ColorType, color: HSBColor) => {
    if (type === "strikeColor") {
      setAnimation((prev) => ({ ...prev, strikeColor: color }));
    } else {
      setAppearance((prev) => ({ ...prev, [type]: color }));
    }
  };

  // UI: Appearance section
  const renderAppearance = () => (
    <Card>
      <Text variant='headingMd' as='h3'>
        Appearance
      </Text>
      <div className='grid grid-cols-2 gap-3 mt-3'>
        <Select
          label='Height'
          options={[{ label: "Value", value: "value" }]}
          value='value'
          onChange={() => {}}
        />
        <Select
          label='Width'
          options={[{ label: "Value", value: "value" }]}
          value='value'
          onChange={() => {}}
        />
        <Select
          label='Border radius'
          options={[{ label: "Value", value: "value" }]}
          value='value'
          onChange={() => {}}
        />
        <Select
          label='Spacing'
          options={[{ label: "Value", value: "value" }]}
          value='value'
          onChange={() => {}}
        />
      </div>
      <div className='flex gap-4 mt-4'>
        {(["defaultColor", "selectedColor", "hoverColor"] as ColorType[]).map((type, idx) => (
          <div key={type} className='flex gap-2.5 items-center relative' style={{ flex: 1 }}>
            <ColorSwatch
              color={appearance[type as "defaultColor" | "selectedColor" | "hoverColor"]}
              onClick={() => setOpenColorPicker(type)}
            />
            <Text variant='bodyMd' as='span'>
              {COLOR_LABELS[type]}
            </Text>
            <ColorPickerPopover
              color={appearance[type as "defaultColor" | "selectedColor" | "hoverColor"]}
              onChange={(color) => handleColorChange(type, color)}
              open={openColorPicker === type}
              onClose={() => setOpenColorPicker(null)}
              left={15 + idx * 150}
              top={0}
            />
          </div>
        ))}
      </div>
    </Card>
  );

  // UI: Animation section
  const renderAnimation = () => (
    <Card>
      <Text variant='headingMd' as='h3'>
        Animation
      </Text>
      <div className='grid grid-cols-2 gap-3 mt-3'>
        <Select
          label='Hover animation'
          options={[
            { label: "Label", value: "label" },
            { label: "Image", value: "image" }
          ]}
          value={animation.hoverAnimation}
          onChange={(value) => setAnimation((prev) => ({ ...prev, hoverAnimation: value }))}
        />
        <Select
          label='Out of stock'
          options={[
            { label: "Strike-out", value: "strike-out" },
            { label: "None", value: "none" }
          ]}
          value={animation.outOfStock}
          onChange={(value) => setAnimation((prev) => ({ ...prev, outOfStock: value }))}
        />
      </div>
      <div className='flex gap-2.5 mt-4 items-center relative'>
        <ColorSwatch
          color={animation.strikeColor}
          onClick={() => setOpenColorPicker("strikeColor")}
        />
        <Text variant='bodyMd' as='span'>
          {COLOR_LABELS.strikeColor}
        </Text>
        <ColorPickerPopover
          color={animation.strikeColor}
          onChange={(color) => handleColorChange("strikeColor", color)}
          open={openColorPicker === "strikeColor"}
          onClose={() => setOpenColorPicker(null)}
          left={10}
          top={-70}
        />
      </div>
    </Card>
  );

  // UI: Preview section
  const renderPreview = () => (
    <Card>
      <Text variant='bodyMd' as='span'>
        Pattern design artistico Carnevale
      </Text>
      <div className='grid grid-cols-8 gap-2 mt-4 mb-4'>
        {["#eee", "#222", "#000", "#a33", "#933", "#b55", "#d22", "#b99"].map((c, i) => (
          <div
            key={i}
            style={{
              boxSizing: "border-box",
              cursor: "pointer",
              background: c,
              paddingTop: "100%",
              width: "100%",
              borderRadius: "8px",
              border: `1px solid ${i === 0 ? "#736F6F" : c}`
            }}
          ></div>
        ))}
      </div>
      <Button fullWidth variant='primary'>
        Add to cart
      </Button>
    </Card>
  );

  // Save handler
  const onSave = () => {
    setOption({
      animation: {
        hoverAnimation: animation.hoverAnimation,
        outOfStock: animation.outOfStock,
        strikeColor: ColorProvider.rgbToHex(ColorProvider.hsbToRgb(animation.strikeColor))
      },
      appearance: {
        height: appearance.height,
        width: appearance.width,
        borderRadius: appearance.borderRadius,
        spacing: appearance.spacing,
        defaultColor: ColorProvider.rgbToHex(ColorProvider.hsbToRgb(appearance.defaultColor)),
        selectedColor: ColorProvider.rgbToHex(ColorProvider.hsbToRgb(appearance.selectedColor)),
        hoverColor: ColorProvider.rgbToHex(ColorProvider.hsbToRgb(appearance.hoverColor))
      }
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size='large'
      title='Title'
      primaryAction={{ content: "Save", onAction: onSave }}
      secondaryActions={[{ content: "Cancel", onAction: onClose }]}
    >
      <Modal.Section>
        <div className='grid gap-4 grid-cols-2'>
          <div style={{ flex: 1, width: "100%" }}>{renderAppearance()}</div>
          <div className='customize-preview' style={{ flex: 1, width: "100%" }}>
            {renderPreview()}
          </div>
          <div style={{ flex: 1, width: "100%" }}>{renderAnimation()}</div>
        </div>
      </Modal.Section>
    </Modal>
  );
};

export default CustomizeModal;
