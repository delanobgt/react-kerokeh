import React from "react";
import {
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  Button
} from "@material-ui/core";
import styled from "styled-components";
import { PFeaturedProductFilter } from "src/store/featured-product";
import BasicSelect from "src/components/generic/input/BasicSelect";
import { goPromise } from "src/util/helper";
import {
  getProductCategories,
  IProductCategory,
  IProductCategoryGetAction
} from "src/store/product-category";

interface IComponentProps {
  filter: PFeaturedProductFilter;
  updateFilter: (_filter: PFeaturedProductFilter) => void;
}

const Div = styled.div`
  margin-bottom: 0.5rem;
`;

function FilterForm(props: IComponentProps) {
  const { filter, updateFilter } = props;

  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [productCategories, setProductCategories] = React.useState<
    IProductCategory[]
  >([]);

  // initial fetch
  const fetch = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [err, res] = await goPromise<IProductCategoryGetAction>(
      getProductCategories({ offset: 0, limit: 5 }, {}, [])
    );
    setLoading(false);

    if (err) {
      console.log({ err });
      setError("error");
    } else {
      setProductCategories(res.productCategories);
    }
  }, [setProductCategories]);
  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div>
      <Typography variant="subtitle2">Filter</Typography>

      {loading ? (
        <CircularProgress size={24} />
      ) : Boolean(error) ? (
        <Button color="primary" variant="outlined" onClick={fetch}>
          Retry load
        </Button>
      ) : (
        <>
          <Div>
            <TextField
              label="Id"
              value={filter.id || ""}
              onChange={e => updateFilter({ id: e.target.value })}
              fullWidth
            />
          </Div>

          <Div>
            <BasicSelect
              style={{ width: "100%" }}
              label="Product Category"
              value={filter.product_category_id || ""}
              onChange={(value: string) =>
                updateFilter({ product_category_id: value })
              }
            >
              <MenuItem value="">No Filter</MenuItem>
              {productCategories.map(productCategory => (
                <MenuItem key={productCategory.id} value={productCategory.id}>
                  {productCategory.name}
                </MenuItem>
              ))}
            </BasicSelect>
          </Div>

          <Div>
            <BasicSelect
              style={{ width: "100%" }}
              label="Published"
              value={filter.published || ""}
              onChange={(value: string) => updateFilter({ published: value })}
            >
              <MenuItem value="">No Filter</MenuItem>
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </BasicSelect>
          </Div>
        </>
      )}
    </div>
  );
}

export default FilterForm;
