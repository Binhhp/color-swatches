import { type FC } from "react";
import { IndexTable, Text, Button, LegacyCard } from "@shopify/polaris";
import type { OptionValue as OptionValueModel } from "@/models/common/setting.model";
import type { IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import type { NonEmptyArray } from "@shopify/polaris/build/ts/src/types";

const PreviewIcon = () => (
  <span role='img' aria-label='preview'>
    🖼️
  </span>
);

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
            <IndexTable.Cell className='text-center'>
              <PreviewIcon />
            </IndexTable.Cell>
            <IndexTable.Cell className='text-center'>
              <Button size='slim' variant='tertiary'>
                Customize
              </Button>
            </IndexTable.Cell>
          </IndexTable.Row>
        ))}
      </IndexTable>
    </LegacyCard>
  );
};

export default OptionValue;
