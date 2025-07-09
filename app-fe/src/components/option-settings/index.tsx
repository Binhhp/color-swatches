import {
  IndexTable,
  Badge,
  Button,
  Text,
  SkeletonBodyText,
  useIndexResourceState,
  LegacyCard
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import type { OptionSetting } from "@/models/common/setting.model";
import { useNavigate } from "@tanstack/react-router";
import { UriProvider } from "@/utils/uri-provider";
import settingStore from "@/stores/setting";

const positionMap: Record<string, string> = {
  "home-page": "Home page",
  "collection-page": "Collection page",
  "product-page": "Product page",
  "cart-page": "Cart page",
  "checkout-page": "Checkout page",
  "search-page": "Search page",
  "blog-page": "Blog page",
  "article-page": "Article page",
  "page-page": "Page page",
  "contact-page": "Contact page"
};

const OptionSettingsTable = () => {
  const { optionSettings, getOptionSettings, isOptionSettingsLoading } = settingStore();

  const [data, setData] = useState<OptionSetting[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setData(optionSettings.slice((page - 1) * pageSize, page * pageSize));
  }, [optionSettings, page, pageSize]);

  useEffect(() => {
    const fetchOptions = async () => {
      await getOptionSettings();
    };
    fetchOptions();
  }, [getOptionSettings]);

  // For selection, pass array of {id} objects to useIndexResourceState
  const selectionData = data.map((item) => ({ id: item.id }));
  const resourceName = { singular: "option", plural: "options" };
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(selectionData);

  const navigate = useNavigate();

  return (
    <div className='mt-10 mb-10'>
      <div style={{ marginBottom: 4 }}>
        <Text variant='headingXl' as='h2'>
          Option settings
        </Text>
      </div>
      <div style={{ marginBottom: 24 }}>
        <Text variant='bodyMd' as='p'>
          Effortlessly manage and display product variants to drive more sales.
        </Text>
      </div>
      {isOptionSettingsLoading ? (
        <div>
          <SkeletonBodyText lines={10} />
        </div>
      ) : (
        <div className='option-setting-list'>
          <LegacyCard>
            <IndexTable
              resourceName={resourceName}
              itemCount={data.length}
              selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length}
              onSelectionChange={handleSelectionChange}
              headings={[
                { title: "Option name" },
                { title: "Status" },
                { title: "Template" },
                { title: "Style" },
                { title: "Display page" },
                { title: "Action" }
              ]}
              pagination={{
                hasNext:
                  data.length === pageSize &&
                  data.length > 0 &&
                  optionSettings.length > page * pageSize,
                onNext: () => setPage(page + 1),
                hasPrevious: page > 1,
                onPrevious: () => setPage(page - 1)
              }}
            >
              {data.map((option, idx) => (
                <IndexTable.Row
                  id={option.id}
                  key={option.id}
                  selected={selectedResources.includes(option.id)}
                  position={idx}
                >
                  <IndexTable.Cell>
                    <Text variant='bodyMd' as='span'>
                      {option.name}
                    </Text>
                    <div style={{ color: "#98A2B3", fontSize: 13 }}>
                      {option.values?.length ?? 0} values
                    </div>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    {option.isActive ? (
                      <Badge tone='success'>Active</Badge>
                    ) : (
                      <Badge tone='warning'>Inactive</Badge>
                    )}
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    {option.template && <Badge tone='info'>{option.template}</Badge>}
                  </IndexTable.Cell>
                  <IndexTable.Cell>{option.style && <Badge>{option.style}</Badge>}</IndexTable.Cell>
                  <IndexTable.Cell>
                    {option.position &&
                      option.position.length > 0 &&
                      option.position.map((pos) => positionMap[pos] || pos).join(", ")}
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <Button
                      size='slim'
                      variant='primary'
                      onClick={() =>
                        navigate({
                          to: UriProvider.KeepParameters(`/options/${option.productOptionId}`)
                        })
                      }
                    >
                      Setting
                    </Button>
                  </IndexTable.Cell>
                </IndexTable.Row>
              ))}
            </IndexTable>
          </LegacyCard>
        </div>
      )}
    </div>
  );
};

export default OptionSettingsTable;
