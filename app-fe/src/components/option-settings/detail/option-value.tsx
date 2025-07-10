import { type FC } from "react";
import { IndexTable, Text, Button, LegacyCard } from "@shopify/polaris";
import type { OptionValue as OptionValueModel } from "@/models/common/setting.model";
import type { IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import type { NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { UploadIcon } from "@shopify/polaris-icons";

export const OptionValue: FC<{ values: OptionValueModel[] }> = ({ values }) => {
  const headings: NonEmptyArray<IndexTableHeading> = [
    { title: "Value" },
    { title: "Preview" },
    { title: "" }
  ];
  return (
    <LegacyCard>
      <IndexTable
        resourceName={{ singular: "value", plural: "values" }}
        itemCount={values?.length ?? 0}
        selectable
        headings={headings}
      >
        {(values || []).map((v, idx) => (
          <IndexTable.Row id={v.value + idx} key={v.value + idx} rowType='data' position={idx}>
            <IndexTable.Cell className='text-center'>
              <Text as='span'>{v.value}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell className='flex'>
              <div className='option-setting-preview flex justify-center pt-2 pb-2'>
                <img src={v.image} />
              </div>
            </IndexTable.Cell>
            <IndexTable.Cell className='text-center'>
              <div className='option-setting-upload flex justify-center pt-2 pb-2'>
                <Button
                  icon={UploadIcon as any}
                  size='large'
                  variant='tertiary'
                  accessibilityLabel='Upload'
                />
              </div>
            </IndexTable.Cell>
          </IndexTable.Row>
        ))}
      </IndexTable>
    </LegacyCard>
  );
};

export default OptionValue;
