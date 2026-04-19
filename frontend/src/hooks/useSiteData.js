import { useEffect, useState } from "react";

import { galleryApi } from "../api/services";
import {
  fallbackCategories,
  fallbackContent,
  fallbackImages,
  fallbackSlider
} from "../data/fallbackData";

export function useSiteData() {
  const [state, setState] = useState({
    loading: true,
    categories: [],
    images: [],
    slider: null,
    content: null,
    error: ""
  });

  useEffect(() => {
    let active = true;

    Promise.all([
      galleryApi.categories(),
      galleryApi.images(),
      galleryApi.slider(),
      galleryApi.content()
    ])
      .then(([categoriesResponse, imagesResponse, sliderResponse, contentResponse]) => {
        if (!active) {
          return;
        }

        setState({
          loading: false,
          categories: categoriesResponse.data.data.categories,
          images: imagesResponse.data.data.images,
          slider: sliderResponse.data.data.slider,
          content: contentResponse.data.data,
          error: ""
        });
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setState({
          loading: false,
          categories: fallbackCategories,
          images: fallbackImages,
          slider: fallbackSlider,
          content: fallbackContent,
          error: "Using fallback portfolio content until the backend is configured."
        });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
