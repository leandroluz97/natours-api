class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const validQuery = { ...this.queryString };
    const excludedProperties = ['page', 'sort', 'limit', 'fields'];
    excludedProperties.forEach((property) => delete validQuery[property]);
    let queryStr = JSON.stringify(validQuery);
    queryStr = JSON.parse(
      queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    );
    this.query = this.query.find(queryStr);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort({
        [this.queryString.sort]: this.queryString.orderby,
      });
    } else {
      this.query = this.query.sort({ createdAt: 'desc' });
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 50;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
