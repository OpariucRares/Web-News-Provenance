namespace WebNewsProvenance.Models
{
    public class CreativeWork
    {
        public string Headline { get; set; }
        public Person Author { get; set; }
        public DateTime DatePublished { get; set; }
        public string Language { get; set; }
        public int WordCount { get; set; }
        public string About { get; set; } 
        public List<MediaObject> AssociatedMedia { get; set; }
        public string Subject { get; set; } 
        public Organization Publisher { get; set; }
    }

    public class Person
    {
        public string Name { get; set; }
    }

    public class Organization
    {
        public string Name { get; set; }
        public string Url { get; set; }
    }

    public class MediaObject
    {
        public string ContentUrl { get; set; }
        public string Caption { get; set; }
        public string EncodingFormat { get; set; }
    }
}
