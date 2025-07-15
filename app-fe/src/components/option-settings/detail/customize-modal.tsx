import { useState, type FC } from "react";
import { Modal, Text, Select, Button, Card, TextField, Tooltip } from "@shopify/polaris";
import type { OptionSetting } from "@/models/common/setting.model";
import { HexColorPicker } from "react-colorful";

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
    return option?.animation?.strikeColor ?? "#D9D9D9";
  }
  return option?.appearance?.[type] ?? "#D9D9D9";
};

const ColorSwatch: FC<{
  color: string;
  onClick: () => void;
}> = ({ color, onClick }) => (
  <div
    onClick={onClick}
    className='w-6 h-6 rounded-full relative border border-gray-300 cursor-pointer'
    style={{ background: color }}
  ></div>
);

const ColorPickerPopover: FC<{
  color: string;
  onChange: (color: string) => void;
  open: boolean;
  onClose: () => void;
  left?: number | string;
  top?: number | string;
}> = ({ color, onChange, open, onClose, left = 0, top = 0 }) => (
  <div
    onMouseLeave={onClose}
    className='absolute z-50 pb-2 pt-2 pl-2 pr-2 bg-white rounded-md border border-gray-200'
    style={{ display: open ? "block" : "none", left, top }}
  >
    <HexColorPicker
      style={{
        height: "150px"
      }}
      color={color}
      onChange={onChange}
    />
  </div>
);

export const CustomizeModal: FC<CustomizeModalProps> = ({ open, onClose, option, setOption }) => {
  // Appearance state
  const [appearance, setAppearance] = useState({
    height: option?.appearance?.height ?? "50",
    width: option?.appearance?.width ?? "50",
    borderRadius: option?.appearance?.borderRadius ?? "8",
    spacing: option?.appearance?.spacing ?? "10",
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Generalized color change handler
  const handleColorChange = (type: ColorType, color: string) => {
    if (type === "strikeColor") {
      setAnimation((prev) => ({ ...prev, strikeColor: color }));
    } else {
      setAppearance((prev) => ({ ...prev, [type]: color }));
    }
  };

  const colorTypes: ColorType[] = ["defaultColor", "selectedColor", "hoverColor"];
  // UI: Appearance section
  const renderAppearance = () => (
    <div className='relative'>
      {openColorPicker && (
        <ColorPickerPopover
          color={appearance[openColorPicker as "defaultColor" | "selectedColor" | "hoverColor"]}
          onChange={(color) => handleColorChange(openColorPicker as ColorType, color)}
          open={openColorPicker !== null}
          onClose={() => setOpenColorPicker(null)}
          left={colorTypes.indexOf(openColorPicker as ColorType) * 150 + 10}
          top={10}
        />
      )}
      <Card>
        <Text variant='headingMd' as='h3'>
          Appearance
        </Text>
        <div className='grid grid-cols-2 gap-3 mt-3'>
          <TextField
            label='Height'
            autoComplete='off'
            type='number'
            value={appearance.height}
            onChange={(value) => setAppearance((prev) => ({ ...prev, height: value }))}
          />
          <TextField
            label='Width'
            autoComplete='off'
            type='number'
            value={appearance.width}
            onChange={(value) => setAppearance((prev) => ({ ...prev, width: value }))}
          />
          <TextField
            label='Border radius'
            autoComplete='off'
            type='number'
            value={appearance.borderRadius}
            onChange={(value) => setAppearance((prev) => ({ ...prev, borderRadius: value }))}
          />
          <TextField
            label='Spacing'
            autoComplete='off'
            type='number'
            value={appearance.spacing}
            onChange={(value) => setAppearance((prev) => ({ ...prev, spacing: value }))}
          />
        </div>
        <div className='flex gap-4 mt-4'>
          {colorTypes.map((type, idx) => (
            <div
              key={type + idx}
              className='flex gap-2.5 items-center relative'
              style={{ flex: 1 }}
            >
              <ColorSwatch
                color={appearance[type as "defaultColor" | "selectedColor" | "hoverColor"]}
                onClick={() => {
                  if (type === openColorPicker) {
                    setOpenColorPicker(null);
                    return;
                  }
                  setOpenColorPicker(type);
                }}
              />
              <Text variant='bodyMd' as='span'>
                {COLOR_LABELS[type]}
              </Text>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const [openColorPickerStrick, setOpenColorPickerStrick] = useState<boolean>(false);
  // UI: Animation section
  const renderAnimation = () => (
    <div className='relative'>
      <ColorPickerPopover
        color={animation.strikeColor}
        onChange={(color) => handleColorChange("strikeColor", color)}
        open={openColorPickerStrick}
        onClose={() => setOpenColorPickerStrick(false)}
        left={10}
        top={-60}
      />
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
              { label: "Basic Ribbon", value: "ribbon" }
            ]}
            value={animation.outOfStock}
            onChange={(value) => setAnimation((prev) => ({ ...prev, outOfStock: value }))}
          />
        </div>
        <div className='flex gap-2.5 mt-4 items-center relative'>
          <ColorSwatch
            color={animation.strikeColor ?? { hue: 0, saturation: 0, brightness: 0 }}
            onClick={() => setOpenColorPickerStrick(!openColorPickerStrick)}
          />
          <Text variant='bodyMd' as='span'>
            {COLOR_LABELS.strikeColor}
          </Text>
        </div>
      </Card>
    </div>
  );

  // UI: Preview section
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const renderBackground = (bg: string, i: number) => {
    if (selectedIndex === i) {
      return appearance.selectedColor;
    }
    if (hoveredIndex === i) {
      return appearance.hoverColor;
    }

    return bg;
  };

  const renderTooltipContent = () => {
    if (animation.hoverAnimation === "label" || !option?.values[0]?.image) {
      return option?.values[0]?.value;
    }
    return <img src={option?.values[0]?.image} />;
  };

  const renderPreview = () => (
    <Card>
      <Text variant='bodyMd' as='span'>
        Pattern design artistico Carnevale
      </Text>
      <div
        className='grid grid-cols-8 mt-4 mb-4'
        style={{
          gap: `${appearance.spacing}px`
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <Tooltip key={`tooltip-${i}`} content={renderTooltipContent()}>
            <div
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedIndex(i)}
              style={{
                boxSizing: "border-box",
                cursor: "pointer",
                background: renderBackground(appearance.defaultColor, i),
                width: `${appearance.width}px`,
                height: `${appearance.height}px`,
                borderRadius: `${appearance.borderRadius}px`,
                border: `1px solid #736F6F`
              }}
            ></div>
          </Tooltip>
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
        strikeColor: animation.strikeColor
      },
      appearance: {
        height: appearance.height,
        width: appearance.width,
        borderRadius: appearance.borderRadius,
        spacing: appearance.spacing,
        defaultColor: appearance.defaultColor,
        selectedColor: appearance.selectedColor,
        hoverColor: appearance.hoverColor
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
