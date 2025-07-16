import { useState, type FC } from "react";
import { IndexTable, Text, Button, LegacyCard, Icon, DropZone, Thumbnail } from "@shopify/polaris";
import type { OptionSetting, OptionValue as OptionValueModel } from "@/models/common/setting.model";
import type { IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import type { NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { NoteIcon, PlusIcon, UploadIcon, XIcon } from "@shopify/polaris-icons";
import { HexColorPicker } from "react-colorful";

export const OptionValue: FC<{
  option: OptionSetting;
  setOption: (options: Partial<OptionSetting>) => void;
}> = ({ option, setOption }) => {
  const createHandleDrop = (valueIndex: number) => {
    return (files: File[]) => {
      const uploadedFile = files[0];

      // Convert file to base64 and set it to the option value
      if (uploadedFile && option.values && option.values[valueIndex]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target?.result as string;

          const updatedValues = option.values.map((v, i) => {
            if (i === valueIndex) {
              return {
                ...v,
                image: base64String
              };
            }
            return v;
          });

          setOption({
            ...option,
            values: updatedValues
          });
        };
        reader.readAsDataURL(uploadedFile);
      }
    };
  };

  const renderPreview = (v: OptionValueModel) => {
    if (option.style?.includes("Image")) {
      return (
        <div className='flex items-center option-setting-image'>
          <Thumbnail size='small' alt='Option image' source={v.image || (NoteIcon as any)} />
        </div>
      );
    }

    return (
      <div className='option-setting-preview flex pt-1 pb-1'>
        <div
          className={`border-gray-300 border-1 rounded-md flex flex-col`}
          style={{
            width: "var(--p-width-800)",
            height: "var(--p-height-800)",
            borderRadius: "var(--p-border-radius-200)"
          }}
        >
          {v.color.split(",").map((c, idx) => (
            <div
              key={`color-${idx}`}
              style={{
                width: "100%",
                height: `${100 / v.color.split(",").length}%`,
                background: c,
                borderTopRightRadius: idx === 0 ? "var(--p-border-radius-200)" : "0px",
                borderTopLeftRadius: idx === 0 ? "var(--p-border-radius-200)" : "0px",
                borderBottomRightRadius:
                  idx === v.color.split(",").length - 1 ? "var(--p-border-radius-200)" : "0px",
                borderBottomLeftRadius:
                  idx === v.color.split(",").length - 1 ? "var(--p-border-radius-200)" : "0px"
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  };

  const [indexColor, setIndexColor] = useState<number>(0);
  const [isOpenColorPicker, setIsOpenColorPicker] = useState<boolean>(false);

  const handleRemoveColor = (valueIndex: number, colorIndex: number) => {
    if (option.values && option.values[valueIndex]) {
      const currentColors = option.values[valueIndex].color.split(",");
      const updatedColors = currentColors.filter((_, idx) => idx !== colorIndex);

      const updatedValues = option.values.map((v, i) => {
        if (i === valueIndex) {
          return {
            ...v,
            color: updatedColors.join(",")
          };
        }
        return v;
      });

      setOption({
        ...option,
        values: updatedValues
      });
    }
  };

  const renderAction = (v: OptionValueModel, idx: number) => {
    if (option.style?.includes("Image")) {
      return (
        <div className='option-setting-upload option-setting-upload-image flex justify-center'>
          <div style={{ width: 35, height: 35 }}>
            <DropZone onDrop={createHandleDrop(idx)}>
              <Icon source={UploadIcon as any} tone='subdued' />
            </DropZone>
          </div>
        </div>
      );
    }

    const colorViews = v.color.split(",");
    return (
      <div className='option-setting-upload relative flex justify-center gap-2 items-center'>
        {v.color &&
          colorViews.map((c, colorIdx) => (
            <div
              key={`color-${colorIdx}`}
              className='relative group'
              style={{
                width: "var(--p-width-800)",
                height: "var(--p-height-800)"
              }}
            >
              <button
                className='border-gray-300 border-1 w-full h-full'
                style={{
                  background: c,
                  borderRadius: "var(--p-border-radius-200)"
                }}
              ></button>
              <div
                className='absolute -top-1 -right-1 rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-amber-50 hover:bg-amber-50'
                onClick={() => handleRemoveColor(idx, colorIdx)}
              >
                <Icon source={XIcon as any} />
              </div>
            </div>
          ))}

        {colorViews.length < 5 && (
          <div className='flex justify-center ml-1.5'>
            <Button
              onClick={() => {
                setIndexColor(idx);
                setIsOpenColorPicker(true);
              }}
              icon={PlusIcon as any}
              size='large'
              variant='tertiary'
              accessibilityLabel='Add'
            />
          </div>
        )}
      </div>
    );
  };

  const [color, setColor] = useState<string>("");

  const handleSaveColor = () => {
    const hexColor = color;

    if (option.values && option.values[indexColor]) {
      const currentColors = option.values[indexColor].color
        ? option.values[indexColor].color.split(",")
        : [];
      const newColors = [...currentColors, hexColor];

      const updatedValues = option.values.map((v, i) => {
        if (i === indexColor) {
          return {
            ...v,
            color: newColors.join(",")
          };
        }
        return v;
      });

      setOption({
        ...option,
        values: updatedValues
      });
    }

    setIsOpenColorPicker(false);
  };

  const headings: NonEmptyArray<IndexTableHeading> = [
    { title: "Value" },
    { title: option.style?.includes("Color") ? "Status" : "Preview" },
    { title: "" }
  ];

  return (
    <div className='relative'>
      <div
        className={`absolute pt-2 border-gray-300 border-1 rounded-md flex flex-col pl-2 pr-2 ${isOpenColorPicker ? "block" : "hidden"}`}
        style={{
          bottom: "70px",
          right: "20px",
          zIndex: 1000,
          background: "var(--p-color-bg-fill)"
        }}
      >
        <HexColorPicker
          color={color}
          onChange={(colorInput) => {
            setColor(colorInput);
          }}
        />
        <div className='flex justify-end gap-1 pt-2 pb-2'>
          <Button onClick={() => setIsOpenColorPicker(false)} variant='tertiary'>
            Cancel
          </Button>
          <Button variant='tertiary' onClick={handleSaveColor}>
            Add
          </Button>
        </div>
      </div>
      <LegacyCard>
        <IndexTable
          resourceName={{ singular: "value", plural: "values" }}
          itemCount={option.values?.length ?? 0}
          selectable={false}
          headings={headings}
        >
          {option.values?.map((v, idx) => (
            <IndexTable.Row id={v.value + idx} key={v.value + idx} rowType='data' position={idx}>
              <IndexTable.Cell className='text-start'>
                <Text as='span'>{v.value}</Text>
              </IndexTable.Cell>
              <IndexTable.Cell className='text-start'>
                <div className='option-setting-preview'>{renderPreview(v)}</div>
              </IndexTable.Cell>
              <IndexTable.Cell className='text-start max-w-17'>
                {renderAction(v, idx)}
              </IndexTable.Cell>
            </IndexTable.Row>
          ))}
        </IndexTable>
      </LegacyCard>
    </div>
  );
};

export default OptionValue;
