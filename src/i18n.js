import i18n from 'i18next';

i18n.init({
  fallbackLng: 'en',
  supportedLngs: ['en', 'pl'],
  resources: {
    en: {
      translation: {
        Source: 'Column field name',
        SourceHelpText:
          'Pick the field which will be used to organize cards in columns, each possible value -> new column',
        ContentType: 'Content Type',
        ContentTypeHelpText: '',
        Title: 'Title',
        TitleHelpText:
          'Pick the field which will be used to display title in card preview',
        Image: 'Image',
        ImageHelpText:
          'Pick the field which will be used to display image in card preview (optional)',
        AdditionalField1: 'Additional Field 1',
        AdditionalField2: 'Additional Field 2',
        AdditionalField3: 'Additional Field 3',
        AdditionalFieldHelpText:
          'Pick the field which will be used to display additional field in card preview (optional)',
      },
    },
    pl: {
      translation: {
        Source: 'Pole kolumny',
        SourceHelpText:
          'Wybierz pole, które będzie użyte do organizowania kart w kolumnach, każda możliwa wartość -> nowa kolumna',
        ContentType: 'Typ zawartości',
        ContentTypeHelpText: '',
        Title: 'Tytuł',
        TitleHelpText:
          'Wybierz pole, które będzie użyte do wyświetlania tytułu w podglądzie karty',
        Image: 'Obraz',
        ImageHelpText:
          'Wybierz pole, które będzie użyte do wyświetlania obrazu w podglądzie karty (opcjonalne)',
        AdditionalField1: 'Dodatkowe Pole 1',
        AdditionalField2: 'Dodatkowe Pole 2',
        AdditionalField3: 'Dodatkowe Pole 3',
        AdditionalFieldHelpText:
          'Wybierz pole, które będzie użyte do wyświetlania dodatkowego pola w podglądzie karty (opcjonalne)',
      },
    },
  },
});

export default i18n;
