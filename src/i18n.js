import i18n from "i18next";

i18n.init({
    fallbackLng: "en",
    supportedLngs: ["en", "pl"],
    resources: {
        en: {
            translation: {
                AllowedSources: "Allowed types: textarea, richtext, markdown, block",
                AllowedTargets:
                    "Allowed types: textarea, list. " +
                    "However, the list must contains two fields: question and answer, which are text or textarea",
                ApiKey: "OpenAI API key",
                Configure: "Configure content types",
                ContentType: "Content Type",
                Generated: "FAQ generated. Remember to save document",
                FieldRequired: "This value should not be blank",
                Source: "FAQ source field",
                SourceHelpText: "The field from which the FAQ will be generated. ",
                Target: "FAQ target field.",
                TargetHelpText: "The field where the FAQ will be saved. ",
                Unique: "The target field cannot be the same field as the source field",
                WrongSource:
                    "The source field does not exist or has unsupported type. ",
                WrongTarget:
                    "The target field does not exist or has unsupported type. ",
            },
        },
        pl: {
            translation: {
                AllowedSources:
                    "Dozwolone typy: długie pole tekstowe, richtext, markdown, block",
                AllowedTargets:
                    "Dozwolone typy: długie pole tekstowe, lista. " +
                    "Jednakże lista musi zawierać dwa pola: question i answer, które są tekstem lub długim polem tekstowym",
                ApiKey: "Klucz API OpenAI",
                Configure: "Skonfiguruj definicje typu",
                ContentType: "Definicja typu",
                Generated: "Zawartość FAQ wygenerowana. Pamiętaj aby zapisać obiekt.",
                FieldRequired: "Ta wartość nie powinna być pusta",
                Source: "Pole źródłowe FAQ",
                SourceHelpText: "Pole, z którego zostanie wygenerowane FAQ. ",
                Target: "Pole docelowe FAQ",
                TargetHelpText: "Pole, w którym zostanie zapisane FAQ. ",
                Unique: "Pole docelowe nie może być tym samym polem, co pole źródłowe",
                WrongSource:
                    "Pole źródłowe nie jest już dostępne lub jest nieodpowiedniego typu. ",
                WrongTarget:
                    "Pole docelowe nie jest już dostępne lub jest nieodpowiedniego typu. ",
            },
        },
    },
});

export default i18n;
