import { capitalize } from "../../config/string";

// Category

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API_BASE_URL, { api } from "../../config/api";

const initialState = {
  isLoading: false,
  navigationTree: null,
};

function navigationTreeFormatter(navigationTree) {
  // Converting the navigationTree into map(FirstLevelCategory, map(SecondLevelCategory, array[ThirdLevelCategory])) this format first.
  const conciseNavigationTree = new Map();

  for (let i = 0; i < navigationTree.length; i++) {
    // Extracting firstLevelCategory, secondLevelCategory, thirdLevelCategory of every

    const thirdLevelCategory = navigationTree[i].name;
    const secondLevelCategory = navigationTree[i].parentCategory.name;
    const firstLevelCategory =
      navigationTree[i].parentCategory.parentCategory.name;

    if (conciseNavigationTree.has(firstLevelCategory)) {
      const subCategories = conciseNavigationTree
        .get(firstLevelCategory)
        ?.get(secondLevelCategory);
      if (subCategories) {
        subCategories.push(thirdLevelCategory);
      } else {
        conciseNavigationTree
          .get(firstLevelCategory)
          ?.set(secondLevelCategory, [thirdLevelCategory]);
      }
    } else {
      conciseNavigationTree.set(
        firstLevelCategory,
        new Map().set(secondLevelCategory, [thirdLevelCategory])
      );
    }
  }

  const newNavigationTree = { categories: [] };

  conciseNavigationTree.forEach((mpSCL, FLC) => {
    FLC = FLC.toLowerCase().replace(/_/g, " ");

    const category = {};
    category.id = FLC;
    category.name = capitalize(FLC);
    category.featured = [];
    category.sections = [];

    mpSCL.forEach((arrTLC, SLC) => {
      SLC = SLC.toLowerCase().replace(/_/g, " ");

      const section = {};
      section.id = SLC;
      section.name = capitalize(SLC);
      section.items = [];
      category.sections.push(section);

      arrTLC.forEach((TLC) => {
        const item = {};
        TLC = TLC.toLowerCase();

        item.name = capitalize(TLC).replace(/_/g, " ");
        item.href = `${FLC}/${SLC}/${TLC}`;
        section.items.push(item);
      });
    });
    newNavigationTree.categories.push(category);
  });

  newNavigationTree.pages = [];

  return newNavigationTree;
}

export const getNavigationTree = createAsyncThunk(
  "category/getNavigationTree",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/cate/get`);
      return navigationTreeFormatter(response.data.content);
    } catch (error) {
      throw rejectWithValue(
        "Error from category/getNavigationTree " + error.message
      );
    }
  }
);

export const cateSlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNavigationTree.pending, (state, action) => {
      state.error = false;
      state.navigationTree = null;
    });
    builder.addCase(getNavigationTree.fulfilled, (state, action) => {
      state.error = false;
      state.navigationTree = action.payload;
    });
    builder.addCase(getNavigationTree.rejected, (state, action) => {
      state.error = action.payload;
      state.navigationTree = null;
    });
  },
});

// export const {  } = cartSlice.actions;
export default cateSlice.reducer;
