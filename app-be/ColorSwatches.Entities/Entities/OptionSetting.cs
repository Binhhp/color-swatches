namespace ColorSwatches.Entities.Entities;
public class OptionSetting
{
    public Guid Id { get; set; }
    public string? ProductOptionId { get; set; }
    public string ProductId { get; set; }
    public bool IsActive { get; set; }
    public Guid StoreId { get; set; }
    public string Template { get; set; }
    public string Style { get; set; }
    public string[] Position { get; set; }
    public OptionSettingAppearance? Appearance { get; set; }
    public OptionSettingAnimation? Animation { get; set; }
    public OptionValue[] Values { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime DateModified { get; set; }
}

public class OptionSettingAnimation
{
    public string? HoverAnimation { get; set; }
    public string? OutOfStock { get; set; }
    public string? StrikeColor { get; set; }
}

public class OptionSettingAppearance
{
    public string? Height { get; set; }
    public string? Width { get; set; }
    public string? BorderRadius { get; set; }
    public string? Spacing { get; set; }
    public string? DefaultColor { get; set; }
    public string? SelectedColor { get; set; }
    public string? HoverColor { get; set; }
}
public class OptionValue
{
    public string Value { get; set; }
    public string Color { get; set; }
    public string Image { get; set; }
    public string Style { get; set; }
}

public static class OptionSettingOutOfStock
{
    public const string StrikeOut = "StrikeOut";
    public const string OutOfStock = "OutOfStock";
}
public static class OptionSettingHoverAnimation
{
    public const string Label = "Label";
    public const string Image = "Image";
}
public static class OptionSettingStyleValue
{
    public const string Circle = "Circle";
    public const string Square = "Square";
}

public static class OptionSettingTemplate
{
    public const string Swatch = "Swatch";
    public const string Button = "Button";
    public const string Dropdown = "Dropdown";
}

public static class OptionSettingStyle
{
    public const string Color = "Color";
    public const string Image = "Image";
    public const string Text = "Text";
    public const string ImageText = "ImageText";
    public const string ColorText = "ColorText";
}

public static class OptionSettingPosition
{
    public const string Homepage = "home-page";
    public const string ProductPage = "product-page";
    public const string CartPage = "cart-page";
    public const string CheckoutPage = "checkout-page";
    public const string CollectionPage = "collection-page";
    public const string SearchPage = "search-page";
    public const string BlogPage = "blog-page";
    public const string ArticlePage = "article-page";
    public const string PagePage = "page-page";
    public const string ContactPage = "contact-page";
}