# DKAN Catalog SDC

This module uses [Drupal SDC](https://www.drupal.org/project/sdc) to provide custom components to present metadata and distributions through Twig templates. 

## Requirements
This SDC module is still considered experimental but in versions of Drupal 10.1 and greater, it is now included in Core. 

## Viewing the provided components
The schema for the components provided by the module can be seen by visiting **Configuration** > **User Interface** > **Single Directory Components** when logged into the site. 

## Using the components
To use the components, you will need to include them in your theme or modules's Twig templates. Each component has certain requirements and if values provided do not match the requirements, Drupal will display the error when refreshing the page. 

For example to include a file download with SVG you will need to add the following to your template file:

```
{{
  include('dkan_catalog_sdc:distribution_download', {
  downloadURL: <<The href for the file to download.>>,
  title: <<The title of the file, will show the file name from url if empty.>>,
  mediaType: <<Media type formated like mimeType/csv>>,
  format: <<Media type but without the mimeType, usually in all uppercase too.>>
}, 
  with_context = false) 
}}
```
