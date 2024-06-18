import React, { useEffect, useRef, useState } from 'react';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import Basemap from '@arcgis/core/Basemap';
import TileLayer from '@arcgis/core/layers/TileLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import './EsriMapComponent.css'; // Import custom styles
import { Button, Menu, MenuItem, Checkbox, FormControlLabel } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const EsriMapComponent = () => {
  const mapRef = useRef(null);
  const viewRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [baseLayer, setBaseLayer] = useState('street');
  const [referenceLayers, setReferenceLayers] = useState({
    cities: false,
    zipCodes: false,
    parcels: false,
  });

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBaseLayerChange = (layer) => {
    setBaseLayer(layer);
  };

  const handleReferenceLayerChange = (layer) => {
    setReferenceLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const streetLayer = new TileLayer({
      url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
    });

    const aerialLayer = new TileLayer({
      url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
    });

    const citiesLayer = new FeatureLayer({
      url: 'https://services.arcgis.com/.../FeatureServer/0', // Replace with actual URL
    });

    const zipCodesLayer = new FeatureLayer({
      url: 'https://services.arcgis.com/.../FeatureServer/1', // Replace with actual URL
    });

    const parcelsLayer = new FeatureLayer({
      url: 'https://services.arcgis.com/.../FeatureServer/2', // Replace with actual URL
    });

    const map = new Map({
      basemap: new Basemap({
        baseLayers: [streetLayer],
      }),
    });

    const view = new MapView({
      container: mapRef.current,
      map: map,
      center: [-118.805, 34.027],
      zoom: 13,
    });

    viewRef.current = view;

    const updateBaseLayer = () => {
      switch (baseLayer) {
        case 'street':
          map.basemap.baseLayers = [streetLayer];
          break;
        case 'aerial':
          map.basemap.baseLayers = [aerialLayer];
          break;
        default:
          map.basemap.baseLayers = [streetLayer];
      }
    };

    const updateReferenceLayers = () => {
      view.map.removeAll();
      if (referenceLayers.cities) view.map.add(citiesLayer);
      if (referenceLayers.zipCodes) view.map.add(zipCodesLayer);
      if (referenceLayers.parcels) view.map.add(parcelsLayer);
    };

    updateBaseLayer();
    updateReferenceLayers();

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, [baseLayer, referenceLayers]);

  return (
    <div className="esri-map-component">
      <div className="map-container" ref={mapRef}></div>
      <div className="zoom-buttons">
        <Button onClick={() => viewRef.current.zoomIn()}>+</Button>
        <Button onClick={() => viewRef.current.zoomOut()}>-</Button>
      </div>
      <div className="layers-menu">
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleMenuClick}
        >
          Layers <ExpandMoreIcon />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem disabled>Base Layer</MenuItem>
          <MenuItem onClick={() => handleBaseLayerChange('street')}>
            <FormControlLabel
              control={<Checkbox checked={baseLayer === 'street'} />}
              label="Street"
            />
          </MenuItem>
          <MenuItem onClick={() => handleBaseLayerChange('aerial')}>
            <FormControlLabel
              control={<Checkbox checked={baseLayer === 'aerial'} />}
              label="Aerial"
            />
          </MenuItem>
          <MenuItem disabled>Reference Layer</MenuItem>
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  checked={referenceLayers.cities}
                  onChange={() => handleReferenceLayerChange('cities')}
                />
              }
              label="Cities"
            />
          </MenuItem>
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  checked={referenceLayers.zipCodes}
                  onChange={() => handleReferenceLayerChange('zipCodes')}
                />
              }
              label="ZIP Codes"
            />
          </MenuItem>
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  checked={referenceLayers.parcels}
                  onChange={() => handleReferenceLayerChange('parcels')}
                />
              }
              label="Assessor Parcels"
            />
          </MenuItem>
        </Menu>
      </div>
      <div className="expand-button">
        <Button
          onClick={() => {
            const url = window.location.href;
            window.open(url, '_blank');
          }}
        >
          Expand
        </Button>
      </div>
    </div>
  );
};

export default EsriMapComponent;
