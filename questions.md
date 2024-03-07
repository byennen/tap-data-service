## 💡 Design Considerations for Scaling and High Performance

### Handling 1 Billion to 100 Billion Tap Records

With a significantly larger dataset, like 1 billion or 100 billion tap records, the design would pivot towards a robust, scalable, and efficient system capable of managing and querying large datasets. Key changes would include:

- **Database Integration:** Moving from .CSV files to a scalable database solution like PostgreSQL.
- **ORM and API Layer:** Utilizing Prisma as an ORM and GraphQL for efficient data querying.
- **Scalability Strategies:** Implementing horizontal scaling, caching, and microservices architecture.
- **Continuous Optimization:** Regular monitoring and optimization for database and application performance.

### Achieving Sub `50ms` Response Times

To consistently achieve sub `50ms` response times, significant adjustments would focus on:

- **In-Memory Data Stores:** Using Redis or Memcached for caching.
- **Database and Code Optimization:** Database performance tuning and code optimization to reduce execution time.
- **Efficient Data Processing:** Utilizing parallel processing and optimized data models.
- **Infrastructure Enhancements:** Adopting microservices, serverless architectures, and edge computing for reduced latency.
